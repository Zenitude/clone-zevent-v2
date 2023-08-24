const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Game', gameSchema);