const Security = require("../../models/securities");

const fetchSecurity = async function(req,res) {
    try {
        const securityLists = await Security.find();
        res.status(200).json(securityLists);
    }
    catch(err) {
        res.status(500).send({message: err});
    }
}

module.exports = { fetchSecurity };