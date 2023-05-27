const mongoose = require('mongoose');

const histroricSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        trim: true
    },
    associations: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Historic', histroricSchema);