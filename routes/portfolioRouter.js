const express = require('express');
const router = express.Router();

const fetchPortfolioController = require("../controllers/portfolioControllers/fetchPortfolioController");
const fetchReturnsController = require("../controllers/portfolioControllers/fetchReturnsController");

router.get("/fetch", fetchPortfolioController.fetchPortfolio);

//returns the current profit at the time of calling the API
router.get("/returns", fetchReturnsController.portfolioReturns);

module.exports = router;