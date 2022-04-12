const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Equipments = new Schema({
    equipmentList: [String],
});

module.exports = mongoose.model("Equipments", Equipments);