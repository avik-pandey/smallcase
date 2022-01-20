const Security = require("../../models/securities");

const addSecurity = async function(req,res) {
    const security = new Security({
        tickerSymbol: req.body.tickerSymbol,
        securityName: req.body.securityName
    });

    try {
        await security.save();
        res.status(200).send({message: "Successfully added a security"});
    }
    catch(err) {
        res.status(500).send({message: "Duplicate security"});
    }
}

module.exports = { addSecurity };