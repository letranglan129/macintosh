const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://letranglan129:letranglan@data.n4qbm.mongodb.net/macintosh_dev?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Connect successfully!!!");
    } catch (error) {
        console.log("Connect failure!!!");
    }
}

module.exports = { connect };