const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Type = new Schema({
    categoryTypeList: [
        {
            name: String,
            slug: String,
            title: String,
        }
    ],
    typeGames: [String],
});

module.exports = mongoose.model("Type", Type);