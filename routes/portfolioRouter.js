const express = require('express');
const router = express.Router();
const Portfolio = require("../models/portfolio");
const {CURRENT_PRICE} = require("../config");

router.get("/fetch", async (req,res) => {
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
});

//returns the current profit at the time of calling the API
router.get("/returns", async (req,res) => {
    try{
        const portfolio = await Portfolio.find();
        if(portfolio.length == 0){
            res.status(200).send({message: "Portfolio is empty"});
        }
        else{
            var totalReturns = 0;
            for(var i = 0; i < portfolio.length; i++)
            {
                var returns = (CURRENT_PRICE - parseInt(portfolio[i].averagePrice)) * parseInt(portfolio[i].quantity);
                totalReturns += returns;
            }
            res.status(200).send({message: "Total returns is " + totalReturns});
        }
    }
    catch(err){
        res.status(400).send({message: "Failed to fetch the API"});
    }
});

module.exports = router;