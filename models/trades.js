const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    tradeId: {
        type: Number,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    tickerSymbol: {
        type: String
    },
    tradeType: {
        type: String,
        enum: ['Buy','Sell']
    },
    quantity: {
        type: Number,
        min: 1
    },
    unitPrice: Number
});

var Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;