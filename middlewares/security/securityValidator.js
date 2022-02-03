//middleware to check if the security's tickerSymbol is in All Caps

function addSecurityValidator(req,res,next) {
    const tickerSymbol = req.body.tickerSymbol;
    if(tickerSymbol === tickerSymbol.toUpperCase())
        next();
    else
        res.status(200).send({message: "The ticker symbol must be in All Caps."});
}

function updateSecurityValidator(req,res,next) {
    const tickerSymbol = req.params.tickerSymbol;
    const data = req.body;
    if(tickerSymbol == tickerSymbol.toUpperCase()) {
        if(tickerSymbol == data.tickerSymbol) {
            next();
        }
        else
            res.status(200).send({message: "You cannot update the ticker symbol of a security"});
    }
    else
        res.status(200).send({message: "The ticker symbol must be in All Caps."});
}

function deleteSecurityValidator(req,res,next) {
    const tickerSymbol = req.params.tickerSymbol;
    if(tickerSymbol == tickerSymbol.toUpperCase())
        next();
    else
        res.status(200).send({message: "The ticker symbol must be in All Caps."});
}

module.exports = { addSecurityValidator, updateSecurityValidator, deleteSecurityValidator };