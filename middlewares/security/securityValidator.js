//middleware to check if the security's tickerSymbol is in All Caps

function addSecurityValidator(req,res,next){
    const tickerSymbol = req.body.tickerSymbol;
    if(tickerSymbol === tickerSymbol.toUpperCase())
        next();
    else
        res.status(500).send({message: "The ticker symbol must be in All Caps."});
}

module.exports = { addSecurityValidator };