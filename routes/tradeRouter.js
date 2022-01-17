const express = require('express');
const router = express.Router();
const Trade = require("../models/trades");
const Portfolio = require('../models/portfolio');
const Security = require('../models/securities');

const {checkIfSecuritiesExist} = require("../helper_functions/util");

router.post("/add", async (req,res) => {
    try{
        const tradeLength = await Trade.count({});
        const trade = new Trade({
            tradeId : tradeLength + 1,
            tickerSymbol : req.body.tickerSymbol,
            tradeType : req.body.tradeType,
            quantity : req.body.quantity,
            unitPrice : req.body.unitPrice,
            timestamp : Date.now()
        });

        const tradeType = req.body.tradeType;
        const tickerSymbol = req.body.tickerSymbol;
        const unitPrice = req.body.unitPrice;
        const quantity = req.body.quantity;

        try{
            if( await checkIfSecuritiesExist(tickerSymbol))
            {
                if(tradeType == "Buy")
                {
                    try{
                        const currentTrade = await Portfolio.findOne({tickerSymbol : tickerSymbol});
                        if( currentTrade == null)
                        {
                            const newSecurity = new Portfolio({
                                tickerSymbol: tickerSymbol,
                                averagePrice: unitPrice,
                                quantity: quantity
                            });
    
                            try{
                                await newSecurity.save();
                            }
                            catch(err){
                                res.status(500).send({message : "Failed to add new trades"});
                                return;
                            }
                        }
                        else{
                            const newQuantity = parseInt(currentTrade.quantity) + parseInt(quantity);
                            const newAveragePrice = (parseFloat(currentTrade.averagePrice)*parseFloat(currentTrade.quantity)
                                +  parseFloat(unitPrice)*parseFloat(quantity))/newQuantity;
                            try{
                                await Portfolio.findByIdAndUpdate(currentTrade._id, {averagePrice: newAveragePrice, quantity: newQuantity});
                            }
                            catch(err){
                                res.status(500).send({message: "Failed to update the portfolio"});
                                return;
                            }
                        }
                    }
                    catch(err)
                    {
                        res.status(500).send({message: "failed to buy the security."});
                        return;
                    }
                }
                else if(tradeType == "Sell")
                {
                    try{
                        const currentTrade = await Portfolio.findOne({ticker_symbol : tickerSymbol});
                        if( currentTrade == null)
                        {
                            res.status(500).send({message: "You do not have holdings of this security."});
                            return;
                        }
                        else{
                            if(currentTrade.quantity < quantity)
                            {
                                res.status(500).send({message: "You do not have sufficient holdings to sell."});
                                return;
                            }
                            else if(currentTrade.quantity == quantity)
                            {
                                try{
                                    await Portfolio.findByIdAndDelete(currentTrade._id);
                                }
                                catch(err){
                                    res.status(500).send({message: "Failed to sell the security"});
                                    return;
                                }
                            }
                            else{
                                const newQuantity = parseInt(currentTrade.quantity) - parseInt(quantity);
                                try{
                                    await Portfolio.findByIdAndUpdate(currentTrade._id, {quantity: newQuantity});
                                }
                                catch(err){
                                    res.status(500).send({message: "Failed to update the portfolio"});
                                    return;
                                }
                            }
                        }
                    }
                    catch(err)
                    {
                        res.status(500).send({message: "Failed to sell the security."});
                        return;
                    }
                }
            }
            else{
                res.status(500).send({message: "Security does not exist. Hence the trade would not be possible."});
                return;
            }
        }
        catch(err){
            res.status(500).send({message: "No such security exist,hence trade is not possible"});
        }
        try{
            await trade.save();
            res.status(200).json(`Adding new trades ${tickerSymbol}`);
        }
        catch(err){
            res.status(500).send({message: err});
        }
    }
    catch(err){
        res.status(500).send({message: "Failed to add new trades"});
    }
});

//fetch the list of all the trades grouped by the security Name
router.get("/fetch", async (req,res) => {
   try
   {
        const securitiesList = await Security.find();
        var tradeListGroupedBySecurity = {};

        for(var i=0;i<securitiesList.length;i++)
        {
            const tickerSymbol = securitiesList[i].tickerSymbol;
            const trade = await Trade.find({tickerSymbol: tickerSymbol});
            tradeListGroupedBySecurity[tickerSymbol] = trade;
        }
        res.status(200).json(tradeListGroupedBySecurity);
   }
   catch(err)
   {
        res.status(500).send({message: "Failed to fetch the list of trades."});
   }
    
});

router.delete("/remove/:tradeId", async (req,res) => {
    var tradeToDelete;
    try{
        tradeToDelete = await Trade.findOne({tradeId:req.params.tradeId});
    }
    catch(err){
        res.status(500).send({message: err})
    }
    if(tradeToDelete.tradeType == "Buy")
    {
        const quantityBought = tradeToDelete.quantity;
        const tickerSymbol = tradeToDelete.tickerSymbol;
        const buyingPrice = tradeToDelete.unitPrice;
        var updatedSecurity;
        try{
            updatedSecurity = await Portfolio.findOne({tickerSymbol: tickerSymbol});
        }
        catch(err){
            res.status(500).send({message: "Failed to fetch the security from portfolio"});
            return;
        }
        const updatedQuantity = parseInt(updatedSecurity.quantity) - parseInt(quantityBought);
        console.log(updatedQuantity);
        if(updatedQuantity == 0)
        {
            try{
                await Portfolio.findByIdAndDelete(updatedSecurity._id);
                await Trade.remove({tradeId: req.params.tradeId});
                res.status(200).send({message: "Successfully deleted the trade and updated the portfolio database"});
                return;
            }
            catch(err){
                res.status(500).send({message: err});
                return;
            }
        }
        const updatedAvgPrice = (updatedSecurity.quantity*updatedSecurity.averagePrice - quantityBought*buyingPrice)/updatedQuantity;
        
        try{
            await Portfolio.findByIdAndUpdate(updatedSecurity._id, {quantity: updatedQuantity,averagePrice: updatedAvgPrice});
            await Trade.remove({tradeId: req.params.tradeId});
            res.status(200).send({message: "Successfully deleted the trade and updated the portfolio database"});
            return;
        }
        catch(err){
            res.status(500).send({message: err});
            return;
        }
    }
    else if(tradeToDelete.tradeType == "Sell")
    {
        const quantitySold = tradeToDelete.quantity;
        const tickerSymbol = tradeToDelete.tickerSymbol;
        var updatedSecurity;
        try{
            updatedSecurity = await Portfolio.findOne({tickerSymbol: tickerSymbol});

            if(updatedSecurity == null){
                //when we sell all the stocks of a company, then we delete that from the portfolio. So in order to delete that trade, we also
                // have to add a new item in the portfolio database.
                const newSecurity = new Portfolio({
                    tickerSymbol: tickerSymbol,
                    averagePrice: tradeToDelete.unitPrice,
                    quantity: quantitySold
                });

                try{
                    await newSecurity.save();
                    await Trade.remove({tradeId: req.params.tradeId});
                    res.status(200).send({message: "Successfully deleted the trade and updated the portfolio database"});
                }
                catch(err){
                    res.status(500).send({message: "Failed to update the portfolio"});
                }
            }
        }
        catch(err){
            res.status(500).send({message: "Failed to fetch the security from portfolio"});
            return;
        }

        const updatedQuantity = quantitySold + updatedSecurity.quantity;

        try{
            await Portfolio.findByIdAndUpdate(updatedSecurity._id, {quantity: updatedQuantity});
            await Trade.remove({tradeId: req.params.tradeId});
            res.status(200).send({message: "Successfully deleted the trade and updated the portfolio database"});
        }
        catch(err){
            res.status(500).send({message: "Failed to update the security in the portfolio"});
            return;
        }
    }
    else{
        res.status(500).send({message: "Trade type must be Buy or Sell only."});
    }
});

router.patch("/update/:tradeId", async (req,res) => {
    
    try{
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

        if(req.body.tradeType && oldTrade.tradeType != updatedTrade.tradeType)
        {
            if(updatedTrade.tradeType == "Sell")
            {
                //changing tradeType from Buy to Sell
                if(oldPortfolio.quantity - oldTrade.quantity - updatedTrade.quantity >=0)
                {
                    updatedPortfolio.quantity = oldPortfolio.quantity - oldTrade.quantity - updatedTrade.quantity;
                    updatedPortfolio.averagePrice = oldPortfolio.averagePrice*oldPortfolio.quantity - 
                                                    oldTrade.unitPrice*oldTrade.quantity - updatedTrade.unitPrice*updatedTrade.quantity;
                    updatedPortfolio.averagePrice = updatedPortfolio.averagePrice/updatedPortfolio.quantity;
                    console.log("Changing from Buying to Selling");
                }
                else{
                    res.status(500).send({message: "Insufficient funds to convert Buy to Sell"});
                    return;
                }
            }
            else if(updatedTrade.tradeType == "Buy"){
                updatedPortfolio.quantity = oldPortfolio.quantity + oldTrade.quantity + updatedTrade.quantity;
                updatedPortfolio.averagePrice = oldPortfolio.averagePrice*oldPortfolio.quantity 
                                                + oldPortfolio.averagePrice*oldTrade.quantity
                                                + updatedTrade.unitPrice*updatedTrade.quantity;
                updatedPortfolio.averagePrice = updatedPortfolio.averagePrice/updatedPortfolio.quantity;
            }
            else{
                res.status(500).send({message: "You cannot have any other trade type other than Buy or Sell"});
                return;
            }
        }

        else if(oldTrade.tradeType == updatedTrade.tradeType)
        {
            console.log("A");
            if(updatedTrade.tradeType == "Buy")
            {
                if(oldPortfolio.quantity - oldTrade.quantity + updatedTrade.quantity >=0)
                {
                    updatedPortfolio.quantity = oldPortfolio.quantity - oldTrade.quantity + updatedTrade.quantity;
                    updatedPortfolio.averagePrice = oldPortfolio.quantity*oldPortfolio.averagePrice 
                                                    - oldTrade.unitPrice*oldTrade.quantity
                                                    + updatedTrade.unitPrice*updatedTrade.quantity;
                    updatedPortfolio.averagePrice = updatedPortfolio.averagePrice/updatedPortfolio.quantity;
                }
                else{
                    res.status(500).send({message: "Insufficient funds to convert Buy to Sell"});
                    return;
                }
            }
            else if(updatedTrade.tradeType == "Sell")
            {
                if(oldPortfolio.quantity + oldTrade.quantity - updatedTrade.quantity >=0)
                {
                    updatedPortfolio.quantity = oldPortfolio.quantity + oldTrade.quantity - updatedTrade.quantity;
                    console.log("In sell quantity update case");
                }
                else{
                    res.status(500).send({message: "No such tradeType is possible"});
                    return;
                }
            }
            else{
                res.status(500).send({message: "You cannot have any other trade type other than Buy or Sell"});
                return;
            }
        }
        else{
            res.status(500).send({message: "No such update is possible"});
            return;
        }
        try{
            await Trade.findByIdAndUpdate(updatedTrade._id,
                {
                    unitPrice: updatedTrade.unitPrice,
                    tradeType: updatedTrade.tradeType,
                    quantity: updatedTrade.quantity,
                    tickerSymbol: updatedTrade.tickerSymbol
                }
            );
        }
        catch(err)
        {
            res.status(500).send({message: err});
            return;
        }

        try{
            await Portfolio.findByIdAndUpdate(updatedPortfolio._id,
                {
                    averagePrice: updatedPortfolio.averagePrice,
                    quantity: updatedPortfolio.quantity
                }   
            );
        }
        catch(err){
            res.status(500).send({message: err});
            return;
        }
        res.status(200).send({message: "Successfully updated the trade"});
    }
    catch(err){
        // res.status(500).send({message: "Request body did not contain all the fields, hence trade updation failed"});
        res.status(500).send({message: err});
    }


});

module.exports = router;