const express = require('express');
const router = express.Router();

const addSecurityController = require("../controllers/securityControllers/addSecurityController");
const deleteSecurityController = require("../controllers/securityControllers/deleteSecurityController");
const updateSecurityController = require("../controllers/securityControllers/updateSecurityController");
const fetchSecurityController = require("../controllers/securityControllers/fetchSecurityController");

const securityValidator = require("../middlewares/security/securityValidator");

//route to add a security to the stock market
router.post("/add", securityValidator.addSecurityValidator, addSecurityController.addSecurity);

//route to fetch the list of all the securities in the stock market
router.get("/fetch", fetchSecurityController.fetchSecurity);

//route to delete a security from the stock market
router.delete("/remove/:tickerSymbol", securityValidator.deleteSecurityValidator ,deleteSecurityController.deleteSecurity);

//route to update a security already exisiting in the stock market
router.patch("/update/:tickerSymbol", securityValidator.updateSecurityValidator ,updateSecurityController.updateSecurity);

module.exports = router;