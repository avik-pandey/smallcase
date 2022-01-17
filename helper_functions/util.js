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

module.exports = {checkIfSecuritiesExist};