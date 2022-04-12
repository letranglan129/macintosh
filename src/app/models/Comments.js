const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comments = new Schema({
    liked: {
        type: Number,
        default: 0,
        require: true,
    },
    userId: { type: String, require: true },
    appId: { type: String, require: true },
    cmtString: { type: String, require: true },
    childComment: { type: String, require: true },
    isReply: {
        type: Boolean,
        default: false,
        require: true,
    },
    replyId: { type: String, require: true },
    userLiked: { type: [String], require: true },
}, {
    timestamps: true,
})

module.exports = mongoose.model("Comments", Comments)