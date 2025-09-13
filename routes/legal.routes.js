const express = require('express');
const Blog = require('../models/post.model');

const router = express.Router();

router.get('/privacy-policy', function (req, res) {
    res.render("user/legal/privacy-policy");
});

router.get('/terms-and-conditions', function (req, res) {
    res.render("user/legal/terms-and-conditions");
});

router.get('/disclaimer', function (req, res) {
    res.render("user/legal/disclaimer");
});

router.get('/cookie-policy', function (req, res) {
    res.render("user/legal/cookie-policy");
});

router.get('/sitemap', function (req, res) {
    res.render("user/legal/sitemap");
});

router.get('/sitemap.xml', async function (req, res) {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

        const baseUrl = "https://www.devcenter.in";

        // Static URLs
        let urls = `
      <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/blog/</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;

        // Blog URLs
        blogs.forEach((blog) => {
            urls += `
        <url>
          <loc>${baseUrl}/blog/${blog.slug}</loc>
          <lastmod>${blog.updatedAt ? blog.updatedAt.toISOString().split("T")[0] : blog.createdAt.toISOString().split("T")[0]}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>
      `;
        });

        // Final sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>
    `;

        res.header("Content-Type", "application/xml");
        res.send(sitemap);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating sitemap");
    }
});


module.exports = router;