const Portfolio = require("../../models/portfolio");

const fetchPortfolio = async function(req,res){
    try{
        const portfolio = await Portfolio.find();
        if(portfolio.length == 0){
            res.status(200).send({message: "Portfolio is empty"});
        }
        else{
            res.status(200).json(portfolio);
        }
    }
    catch(err){
        res.status(400).send({message: "Failed to fetch the API"});
    }
}

module.exports = {fetchPortfolio};