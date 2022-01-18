const Trade = require("../../models/trades");
const Portfolio = require('../../models/portfolio');
const Security = require('../../models/securities');

const {checkIfSecuritiesExist} = require("../../helper_functions/util");

const deleteTrade = async function(req,res){
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
}

module.exports = { deleteTrade };
