const Security = require("../../models/securities");
const Portfolio = require("../../models/portfolio");

const deleteSecurity = async function(req,res) {
    try {
        await Security.remove({tickerSymbol: req.params.tickerSymbol});
        await Portfolio.deleteMany({tickerSymbol: req.params.tickerSymbol});
        res.status(200).send({message: "Successfully deleted a security"});
    }
    catch(err) {
        res.status(500).send({message: "Security does not exist"});
    }
}

module.exports = { deleteSecurity };