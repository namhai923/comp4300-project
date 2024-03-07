const mongoose = require('mongoose');
const uuid = require('uuid');

let message = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true
        },
        sending: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

let conversation = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    latestMessage: {
        type: message
    },
    unRead: {
        type: Number,
        default: 0,
        required: true
    },
    messages: {
        type: [message],
        default: []
    }
});

let contactSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    }
});

let pokeSchema = new mongoose.Schema({
    pokemon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon'
    }
});

let notificationSchema = new mongoose.Schema(
    {
        notificationId: {
            type: String,
            default: uuid.v4
        },
        userName: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { timestamps: true }
);

let userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dob: {
            type: Date
        },
        phoneNumber: {
            type: String
        },
        creditPoints: {
            type: Number,
            default: 100
        },
        contacts: {
            type: [contactSchema],
            default: []
        },
        conversationHistory: {
            type: [conversation],
            default: []
        },
        notificationList: {
            type: [notificationSchema],
            default: []
        },
        pokeCollection: {
            type: [pokeSchema],
            default: []
        }
    },
    { collection: 'Users' }
);

module.exports = mongoose.model('User', userSchema);
