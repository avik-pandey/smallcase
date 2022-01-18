const Security = require("../../models/securities");

const deleteSecurity = async function(req,res){
    try{
        const securityToDelete = await Security.remove({tickerSymbol: req.params.tickerSymbol});
        res.status(200).send({message: "Successfully deleted a security"});
    }
    catch(err){
        res.status(500).send({message: "Security does not exist"});
    }
}

module.exports = { deleteSecurity };