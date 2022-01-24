1. **Security Router**
* **a. /api/security/add** Add a new securityName(i.e,. add a new company in the stock market) POST
* **b. /api/security/fetch** Fetch the list of all the securities(company name) GET.
* **c. /api/security/remove** Delist a company from the stock market DELETE.
* **d. /api/security/update** Update a company in the stock market PATCH.

2. **Trade Router**
* **a. /api/trade/add** Add a new trade POST
 * * Fetch the trade details from the req.body.
 * * Check if the ticker Symbol exists in the security database.
 * * If no, then return an error message.
 * * If yes, move forward with the function.
 * * If the trade type is BUY, add a new trade and update in the portfolio database.
 * * If the trade type is SELL, check if the stock holdings does not become negative upon selling.
 * * Add a new trade and update the portfolio database.
* **b. /api/trade/remove** Remove a trade DELETE
* **c. /api/trade/update** Update a trade PATCH
* **d. /api/trade/fetch** Return the list of every trade GET

3. **Portfolio Router**
* **a. /api/portfolio/fetch** Get the whole view of all the holdings in the portfolio.
* **b. /api/portfolio/returns** Get the total profit at the time of calling this API.


**Assignment Explaination**: https://docs.google.com/document/d/1teFVs8rLcmOT6rOf7ghZSsNIKv-qu6USRIyU8cETlmA/edit?usp=sharing

**API link**: [API FOR PORTFOLIO TRACKING-APP](https://smallcase-portfolio-api-avik.herokuapp.com/)

**WEB-INTERFACE** [PORTFOLIO TRACKING-APP](https://smallcase-avik-frontend.herokuapp.com/)

