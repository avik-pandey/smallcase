const mongoose = require('mongoose');

const {Schema} = mongoose;

const securitySchema = new Schema({
    tickerSymbol: {
        type:String,
        required: true,
        unique: true
    },
    securityName: {
        type: String,
        required: true,
        unique: true
    }
});

const Security = mongoose.model("Security",securitySchema);

module.exports = Security;