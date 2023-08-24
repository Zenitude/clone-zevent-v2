const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    birthdate: {
        type: Date,
        required: true,
        trim: true
    },
    fullaccess: {
        type: Boolean,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('User', userSchema);