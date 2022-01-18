const Security = require("../models/securities");

//helper function to check for duplicate entry of security
const checkIfSecuritiesExist = async(ticker) => {
    try{
        const data = await Security.findOne({tickerSymbol: ticker});
        if(data)
            return true;
        else
            return false;
    }
    catch(err){
        throw({message: 'fetching of securities failed'});
    }
};

//helper function to assign a unique tradeId to every trade based on the req.body received.
const assignTradeId = (data) => {
    const tickerSymbol = data.tickerSymbol;
    var tradeId = tickerSymbol;
    const random_number = Math.ceil(Math.random()%10000);
    const more_randomized_number = (random_number*Date.now()) % 1000;
    tradeId = tradeId + more_randomized_number.toString();
    return tradeId;
}

module.exports = { checkIfSecuritiesExist, assignTradeId};