const Security = require("../../models/securities");

const updateSecurity = async function(req,res){
    try{
        const updatedSecurity = await Security.updateOne(
            {tickerSymbol: req.params.tickerSymbol},
            {$set: {tickerSymbol: req.body.tickerSymbol, securityName: req.body.securityName}}
        );
        res.status(200).send({message: `Successfully updated ${req.params.tickerSymbol} details`});
    }
    catch(err){
        res.status(500).send({message: "Security does not exist"});
    }
}

module.exports = { updateSecurity };