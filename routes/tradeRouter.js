const express = require('express');
const router = express.Router();

const addTradeController = require("../controllers/tradeControllers/addTradeController");
const fetchTradeController = require("../controllers/tradeControllers/fetchTradeController");
const updateTradeController = require("../controllers/tradeControllers/updateTradeController");
const deleteTradeController = require("../controllers/tradeControllers/deleteTradeController");

const tradeValidator = require("../middlewares/trade/tradeValidator");

//post the trade details in the Trades collection
router.post("/add", tradeValidator.addTradeValidator ,addTradeController.addTrade);

//fetch the list of all the trades grouped by the security Name
router.get("/fetch", fetchTradeController.fetchTrade);

//delete the trade from the Trades collection
router.delete("/remove/:tradeId", deleteTradeController.deleteTrade);

//update the trade from the Trades collection
router.patch("/update/:tradeId", tradeValidator.updateTradeValidator,updateTradeController.updateTrade);

module.exports = router;