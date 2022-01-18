const express = require('express');
const router = express.Router();

const addTradeController = require("../controllers/tradeControllers/addTradeController");
const fetchTradeController = require("../controllers/tradeControllers/fetchTradeController");
const updateTradeController = require("../controllers/tradeControllers/updateTradeController");
const deleteTradeController = require("../controllers/tradeControllers/deleteTradeController");

router.post("/add", addTradeController.addTrade);

//fetch the list of all the trades grouped by the security Name
router.get("/fetch", fetchTradeController.fetchTrade);

router.delete("/remove/:tradeId", deleteTradeController.deleteTrade);

router.patch("/update/:tradeId", updateTradeController.updateTrade);

module.exports = router;