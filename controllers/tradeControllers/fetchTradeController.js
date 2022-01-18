const Trade = require("../../models/trades");
const Security = require('../../models/securities');


const fetchTrade = async function(req,res){
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
}

module.exports = { fetchTrade };
