const Trade = require("../../models/trades");
const Portfolio = require('../../models/portfolio');

const {checkIfSecuritiesExist} = require("../../helper_functions/util");

const updateTrade = async function(req,res) {
    try {
        const oldTrade = await Trade.findOne({
            tradeId: req.params.tradeId
        });
        
        const tradeData = req.body;
        var updatedTrade = JSON.parse(JSON.stringify(oldTrade));
        const oldPortfolio = await Portfolio.findOne({tickerSymbol: oldTrade.tickerSymbol});
        var updatedPortfolio = JSON.parse(JSON.stringify(oldPortfolio));

        updatedTrade.quantity = tradeData.quantity;
        updatedTrade.unitPrice = tradeData.unitPrice;
        updatedTrade.tradeType = tradeData.tradeType;
        updatedTrade.tickerSymbol = tradeData.tickerSymbol;

        if(req.body.tradeType && oldTrade.tradeType != updatedTrade.tradeType) {
            if(updatedTrade.tradeType == "Sell") {
                //changing tradeType from Buy to Sell
                if(oldPortfolio.quantity - oldTrade.quantity - updatedTrade.quantity >=0) {
                    updatedPortfolio.quantity = oldPortfolio.quantity - oldTrade.quantity - updatedTrade.quantity;
                    updatedPortfolio.averagePrice = oldPortfolio.averagePrice*oldPortfolio.quantity - 
                                                    oldTrade.unitPrice*oldTrade.quantity - updatedTrade.unitPrice*updatedTrade.quantity;
                    updatedPortfolio.averagePrice = updatedPortfolio.averagePrice/updatedPortfolio.quantity;
                    console.log("Changing from Buying to Selling");
                }
                else {
                    res.status(200).send({message: "Insufficient funds to convert Buy to Sell"});
                    return;
                }
            }
            else if(updatedTrade.tradeType == "Buy") {
                updatedPortfolio.quantity = oldPortfolio.quantity + oldTrade.quantity + updatedTrade.quantity;
                updatedPortfolio.averagePrice = oldPortfolio.averagePrice*oldPortfolio.quantity 
                                                + oldPortfolio.averagePrice*oldTrade.quantity
                                                + updatedTrade.unitPrice*updatedTrade.quantity;
                updatedPortfolio.averagePrice = updatedPortfolio.averagePrice/updatedPortfolio.quantity;
            }
            else {
                res.status(200).send({message: "You cannot have any other trade type other than Buy or Sell"});
                return;
            }
        }

        else if(oldTrade.tradeType == updatedTrade.tradeType) {
            console.log("A");
            if(updatedTrade.tradeType == "Buy") {
                if(oldPortfolio.quantity - oldTrade.quantity + updatedTrade.quantity >=0) {
                    updatedPortfolio.quantity = oldPortfolio.quantity - oldTrade.quantity + updatedTrade.quantity;
                    updatedPortfolio.averagePrice = oldPortfolio.quantity*oldPortfolio.averagePrice 
                                                    - oldTrade.unitPrice*oldTrade.quantity
                                                    + updatedTrade.unitPrice*updatedTrade.quantity;
                    updatedPortfolio.averagePrice = updatedPortfolio.averagePrice/updatedPortfolio.quantity;
                }
                else {
                    res.status(200).send({message: "Insufficient funds to convert Buy to Sell"});
                    return;
                }
            }
            else if(updatedTrade.tradeType == "Sell") {
                if(oldPortfolio.quantity + oldTrade.quantity - updatedTrade.quantity >=0) {
                    updatedPortfolio.quantity = oldPortfolio.quantity + oldTrade.quantity - updatedTrade.quantity;
                    console.log("In sell quantity update case");
                }
                else {
                    res.status(200).send({message: "No such tradeType is possible"});
                    return;
                }
            }
            else {
                res.status(200).send({message: "You cannot have any other trade type other than Buy or Sell"});
                return;
            }
        }
        else {
            res.status(200).send({message: "No such update is possible"});
            return;
        }
        try {
            await Trade.findByIdAndUpdate(updatedTrade._id,
                {
                    unitPrice: updatedTrade.unitPrice,
                    tradeType: updatedTrade.tradeType,
                    quantity: updatedTrade.quantity,
                    tickerSymbol: updatedTrade.tickerSymbol
                }
            );
        }
        catch(err) {
            res.status(200).send({message: err});
            return;
        }

        try {
            await Portfolio.findByIdAndUpdate(updatedPortfolio._id,
                {
                    averagePrice: updatedPortfolio.averagePrice,
                    quantity: updatedPortfolio.quantity
                }   
            );
        }
        catch(err) {
            res.status(200).send({message: err});
            return;
        }
        res.status(200).send({message: "Successfully updated the trade"});
    }
    catch(err) {
        // res.status(500).send({message: "Request body did not contain all the fields, hence trade updation failed"});
        res.status(200).send({message: err});
    }
}

module.exports = { updateTrade };
