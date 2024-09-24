const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    columns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
    }],
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
