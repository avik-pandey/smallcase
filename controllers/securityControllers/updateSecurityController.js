const Security = require("../../models/securities");
const Portfolio = require("../../models/portfolio");
const Trade = require("../../models/trades");

//update the details of a company. 
// We can only edit the securityName of a company and not the tickerSymbol.
const updateSecurity = async function(req,res) {
    try {
        const updatedSecurity = await Security.updateOne(
            {tickerSymbol: req.params.tickerSymbol},
            {$set: {securityName: req.body.securityName}}
        );
        console.log(updateSecurity);
        res.status(200).send({message: `Successfully updated ${req.params.tickerSymbol} details`});
    }
    catch(err) {
        res.status(200).send({message: "Security does not exist"});
    }
}

module.exports = { updateSecurity };