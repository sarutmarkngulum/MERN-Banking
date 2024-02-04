const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['deposit', 'withdraw', 'transfer'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = transactionModel = mongoose.model('Transaction', transactionSchema);