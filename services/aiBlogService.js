const crypto = require("crypto");
const slugify = require("slugify");
const sanitizeHtml = require("sanitize-html");
const readingTime = require("reading-time");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const openai = require("../config/openai");
const { cloudinary } = require("../config/cloudinary");


const CLEAN = (s) => s.replace(/\s+/g, " ").trim();

async function generateBlogFromTopic(topic) {
    // 1) Ask OpenAI to produce structured blog parts (title, meta, html, keywords)
    // Using the Responses API with structured JSON output
    const systemPrompt = `
You are an expert tech blogger and SEO strategist. 
Write like a helpful human, with examples, code blocks (if relevant), and natural transitions.
Target Indian dev audience; avoid clickbait; be factual and current.
Return STRICT JSON matching this schema:
{
 "title": string,
 "metaTitle": string,
 "metaDescription": string,
 "keywords": string[], 
 "slugSuggestion": string,
 "sectionsHtml": string, // full HTML for article body. Use <section> with a UNIQUE id for EVERY section (example: id="introduction", id="key-takeaways", id="faq", id="conclusion"). All <h2>/<h3> must be inside these sections..
 "excerpt": string,      // 1-2 sentence summary
 "jsonLd": object        // BlogPosting schema.org JSON-LD object
}
`;

    const userPrompt = `
Topic: "${topic}"

Requirements:
- 1500–2000 words.
- Clear introduction.
- Add a TOC (<nav> with links to all section ids) after the introduction (optional).
- Maintain a proper H2/H3 hierarchy with descriptive headings.
- Include code samples if relevant.
- Add an FAQ (3–5 Q&As).
- Every <section> MUST have an id attribute (example: id="introduction", id="main-content", id="faq", id="conclusion").
- Do NOT include related articles section.
- Write in a crisp, friendly tone. Avoid fluff. Optimize for featured snippets.

SEO:
- metaTitle ≤ 60 chars, metaDescription 150–160 chars.
- keywords: 6–10 semantically relevant.

Return ONLY JSON.
`;

    const resp = await openai.responses.create({
        model: "gpt-4o",
        input: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
    });

    let raw = resp.output_text ?? String(resp?.output?.[0]?.content?.[0]?.text || "");
    raw = raw.replace(/```json/i, "").replace(/```/g, "").trim();

    let data;
    try { data = JSON.parse(raw); } catch { throw new Error("AI did not return valid JSON."); }

    const safeHtml = sanitizeHtml(data.sectionsHtml, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            "section", "img", "h2", "h3", "h4", "code", "pre", "nav"
        ]),
        allowedAttributes: {
            a: ["href", "name", "target", "rel"],
            img: ["src", "alt"],
            code: ["class"],
            section: ["id"],   // allow id for section links
            h2: ["id"],
            h3: ["id"],
            h4: ["id"]
        },
        transformTags: {
            // only force rel, keep target as-is (so target="_self" works for jump links)
            a: (tagName, attribs) => {
                return {
                    tagName: "a",
                    attribs: {
                        ...attribs,
                        rel: "nofollow noopener noreferrer",
                        target: attribs.target || "_blank"
                    }
                };
            }
        }
    });


    const title = CLEAN(data.title || topic);
    const slugBase = data.slugSuggestion || title;
    let slug = slugify(slugBase, { lower: true, strict: true });
    if (!slug) slug = slugify(topic, { lower: true, strict: true });

    const metaTitle = CLEAN(data.metaTitle || title);
    const metaDescription = CLEAN(data.metaDescription || "");
    const keywords = Array.isArray(data.keywords) ? data.keywords.slice(0, 10) : [];
    const excerpt = CLEAN(data.excerpt || "");
    const read = readingTime(safeHtml);
    const readingMinutes = Math.max(3, Math.round(read.minutes));

    const topicHash = crypto.createHash("sha1").update(CLEAN(topic)).digest("hex");

    // 3) Create featured image with OpenAI Images API (gpt-image-1)
    const imagePrompt = `
Professional stock photo style featured image for a tech blog article: "${topic}".
Modern, clean blog banner style. Minimal illustration or abstract background, 
wide aspect ratio, no text, no humans, suitable for use as a website hero image.
High-quality, realistic, abstract-tech background.
`;
    const img = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        size: "1792x1024",
        quality: "hd"
    });
    const imgUrl = img.data?.[0]?.url;
    if (!imgUrl) throw new Error("Image generation failed.");

    // Download image to /public/uploads
    // const uploadsDir = path.join(process.cwd(), "public", "uploads");
    // if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    // const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer" });
    // const imgPath = `/uploads/${slug}.jpg`;
    // fs.writeFileSync(path.join(process.cwd(), "public", imgPath), imgRes.data);

    // Upload Image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(imgUrl, {
        folder: "devcenter_blogs",
        public_id: slug,
        overwrite: true,
        resource_type: "image"
    });
    const imgPath = uploadRes.secure_url;

    // 4) Build JSON-LD (ensure canonical)
    const canonicalUrl = `${process.env.SITE_URL}/blog/${slug}`;
    const schemaJsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": metaTitle,
        "description": metaDescription,
        "image": `${process.env.SITE_URL}${imgPath}`,
        "url": canonicalUrl,
        "datePublished": new Date().toISOString(),
        "author": { "@type": "Person", "name": "DevCenter Editorial" },
        ...((typeof data.jsonLd === "object" && data.jsonLd) || {})
    };

    return {
        title,
        slug,
        html: safeHtml,
        excerpt,
        metaTitle,
        metaDescription,
        keywords,
        readingMinutes,
        featuredImagePath: imgPath,
        status: "published",
        canonicalUrl,
        schemaJsonLd,
        topicHash
    };
}

module.exports = { generateBlogFromTopic };