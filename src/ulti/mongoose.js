module.exports = {

    //Use to find
    multiMongooseToObj(mongooses) {
        return mongooses.map(mongoose => mongoose.toObject());
    },


    //Use to findOne
    singleMongooseToObj(mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },

}