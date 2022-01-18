const Trade = require("../../models/trades");
const Portfolio = require('../../models/portfolio');

const {checkIfSecuritiesExist} = require("../../helper_functions/util");

const addTrade = async function(req,res){
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
                        res.status(500).send({message: "Failed to buy the security."});
                        return;
                    }
                }
                else if(tradeType == "Sell")
                {
                    try{
                        const currentTrade = await Portfolio.findOne({tickerSymbol : tickerSymbol});
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
            res.status(200).json("Trade has been successfully registered.");
        }
        catch(err){
            res.status(500).send({message: "Failed to register the trade."});
        }
    }
    catch(err){
        res.status(500).send({message: "Failed to register the trade."});
    }
}

module.exports = { addTrade };
