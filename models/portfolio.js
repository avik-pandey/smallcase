const mongoose = require('mongoose');

const {Schema} = mongoose;

const portfolioSchema = new Schema({
    ticker_symbol: {
        type: String,
        required: true,
        unique: true
    },
    averagePrice: {
        type:Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const Portfolio = mongoose.model('Portfolio',portfolioSchema);

module.exports = Portfolio;