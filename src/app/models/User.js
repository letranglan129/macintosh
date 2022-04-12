const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({

    type: {
        type: String,
        required: true,
    },
    local: {
        username: {
            type: String,
        },
        address: {
            type: String,
            default: '',
        },
        firstName: {
            type: String,
             default: '',
        }, 
        lastName: {
            type: String,
             default: '',
        }, 
        password: {
            type: String,
        },
        email: {
            type: String,
        }, 
        access: {
            type: String,
            default: 'user',
        }, 
        provider: {
            type: String,
            default: 'local',
        },
        avatar: {
            type: String,
            default: '/img/user1.jpg',
        },
    },

    google: {
        id:  {
            type: String,
        },
        username: {
            type: String,
        },
        address: {
            type: String,
            default: '',
        },
        firstName: {
            type: String,
             default: '',
        }, 
        lastName: {
            type: String,
             default: '',
        }, 
        token: {
            type: String,
        },
        email: {
            type: String,
        }, 
        access: {
            type: String,
            default: 'user',
        }, 
        provider: {
            type: String,
        },
        avatar: {
            type: String,
            default: '/img/user1.jpg',
        },
    },

    facebook: {
        id:  {
            type: String,
        },
        username: {
            type: String,
        },
        address: {
            type: String,
            default: '',
        },
        firstName: {
            type: String,
             default: '',
        }, 
        lastName: {
            type: String,
             default: '',
        }, 
        token: {
            type: String,
        },
        email: {
            type: String,
        }, 
        access: {
            type: String,
            default: 'user',
        }, 
        provider: {
            type: String,
        },
        avatar: {
            type: String,
            default: '/img/user1.jpg',
        },
    }
},{timestamp: true});

module.exports = mongoose.model("User", User);