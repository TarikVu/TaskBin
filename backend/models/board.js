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
        type: Number,
        default: 1
    } // Default to userId 1
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
