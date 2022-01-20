const Trade = require("../../models/trades");

//middleware to check if the quantity and unitPrice is positive, trade type must be only buy or sell and the tickerSymbol must exist 
// in the securities collection.
function addTradeValidator(req,res,next) {
    var data = req.body;

    if(Number.isInteger(data.quantity)) {
        if(Number(data.quantity) > 0) {
            if(Number(data.unitPrice) > 0) {
                if(data.tickerSymbol === data.tickerSymbol.toUpperCase()) {
                    if(data.tradeType == "Buy" || data.tradeType == "Sell")
                        next();
                    else
                        res.status(500).send({message: "The trade type should be only Buy or Sell"});
                }   
                else
                    res.status(500).send({message: "The tickerSymbol should be in upper case"});
            }
            else
                res.status(500).send({message: "The unitPrice should be positive"});
        }
        else
            res.status(500).send({message: "The quantity should be positive"});
    }
    else
        res.status(500).send({message: "The quantity to buy should be an integer."});
}

//middleware to check if the req.params is a valid one and exists in the trade collection.
//Check if the quantity and unitPrice is a number and is positive.
//Check if the tradeType is Buy or Sell
async function updateTradeValidator(req,res,next) {
    const data = req.params;
    const tradeData = req.body;
    if(Number.isInteger(tradeData.quantity)) {
        if(Number(tradeData.quantity) > 0) {
            if(Number(tradeData.unitPrice) > 0) {
                if(tradeData.tickerSymbol === tradeData.tickerSymbol.toUpperCase()) {
                    if(tradeData.tradeType == "Buy" || tradeData.tradeType == "Sell")
                        next();
                    else
                        res.status(500).send({message: "The trade type should be only Buy or Sell"});
                }   
                else
                    res.status(500).send({message: "The tickerSymbol should be in upper case"});
            }
            else
                res.status(500).send({message: "The unitPrice should be positive"});
        }
        else
            res.status(500).send({message: "The quantity should be positive"});
    }
    else
        res.status(500).send({message: "The quantity to buy should be an integer."});
}


module.exports = { addTradeValidator, updateTradeValidator };