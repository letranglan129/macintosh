const mongoose = require("mongoose")
const Schema = mongoose.Schema

const News = new Schema({
    id: { type: String },
    user: { 
        id: { type: String, require: true },
        avatar: { type: String, require: true },
        name: { type: String, require: true },
    },
    type: { type: String, require: true },
    titleNews: { type: String, require: true },
    desc: { type: String, require: true },
    img: { type: String, require: true },
    tag: { type: [String], require: true },
    liked: { type: Number, require: true, default: 0 },
    userLiked: { type: [String], require: true },
    slug: { type: String, require: true },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true,
})

module.exports = mongoose.model("News", News)