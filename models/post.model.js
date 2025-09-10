const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    html: { type: String, required: true },
    excerpt: String,
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    readingMinutes: Number,
    featuredImagePath: String, // local path under /public
    status: { type: String, enum: ["draft", "published"], default: "published" },
    canonicalUrl: String,
    schemaJsonLd: Object,
    createdAt: { type: Date, default: Date.now },
    publishedAt: { type: Date, default: Date.now },
    topicHash: { type: String, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema);

// featuredImage: { type: String, required: true, },