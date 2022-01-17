const { application } = require('express');
const express = require('express');
const router = express.Router();

const Security = require('../models/securities');

//route to add a security to the stock market
router.post("/add", async (req,res) => {

    const security = new Security({
        tickerSymbol: req.body.tickerSymbol,
        securityName: req.body.securityName
    });

    try{
        await security.save();
        res.status(200).send({message: "Successfully added a security"});
    }
    catch(err){
        res.status(500).send({message: "Duplicate security"});
    }
});

//route to fetch the list of all the securities in the stock market
router.get("/fetch", async (req,res) => {
    try{
        const securityLists = await Security.find();
        res.status(200).json(securityLists);
    }
    catch(err){
        res.status(500).send({message: err});
    }
});

//route to delete a security from the stock market
router.delete("/remove/:tickerSymbol", async(req,res) => {
    try{
        const securityToDelete = await Security.remove({tickerSymbol: req.params.tickerSymbol});
        res.status(200).send({message: "Successfully deleted a security"});
    }
    catch(err){
        res.status(500).send({message: "Security does not exist"});
    }
});

//route to update a security already exisiting in the stock market
router.patch("/update/:tickerSymbol", async (req,res) => {
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
});

module.exports = router;