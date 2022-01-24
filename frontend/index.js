function loadPortfolioTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://smallcase-portfolio-api-avik.herokuapp.com/api/portfolio/fetch");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        var counter = 1;
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td>'+counter+'</td>';
          trHTML += '<td>'+object['tickerSymbol']+'</td>';
          trHTML += '<td>'+object['averagePrice']+'</td>';
          trHTML += '<td>'+object['quantity']+'</td>';
          trHTML += "</tr>";
          counter++;
        }
        document.getElementById("portfolio-table").innerHTML = trHTML;
      }
    };
  }

  function showCurrentReturns(){
      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", "https://smallcase-portfolio-api-avik.herokuapp.com/api/portfolio/returns");
      xhttp.send();
      xhttp.onreadystatechange = function(){
          const objects = JSON.parse(this.responseText);
          Swal.fire(objects["message"]);
      }
  }

  function loadSecurityTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://smallcase-portfolio-api-avik.herokuapp.com/api/security/fetch");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        var counter = 1;
        for (let object of objects) {
          trHTML += '<tr>'; 
          trHTML += '<td>'+counter+'</td>';
          trHTML += '<td>'+object['tickerSymbol']+'</td>';
          trHTML += '<td>'+object['securityName']+'</td>';
          trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="editSecurity(\''+object['tickerSymbol']+'\')">Edit</button>';
          trHTML += '<button type="button" class="btn btn-outline-danger" onclick="deleteSecurity(\''+object['tickerSymbol']+'\')">Del</button></td>';
          trHTML += "</tr>";
          counter++;
        }
        document.getElementById("security-table").innerHTML = trHTML;
      }
    };
  }

  function showSecurityCreateBox() {
    Swal.fire({
      title: 'Create Security',
      html:
        '<input id="id" type="hidden">' +
        '<input id="tickerSymbol" class="swal2-input" placeholder="Ticker Symbol">' +
        '<input id="securityName" class="swal2-input" placeholder="Security Name">',
      focusConfirm: false,
      preConfirm: () => {
        securityCreate();
      }
    })
  }
  
  function securityCreate() {
    const tickerSymbol = document.getElementById("tickerSymbol").value;
    const securityName = document.getElementById("securityName").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://smallcase-portfolio-api-avik.herokuapp.com/api/security/add");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "tickerSymbol": tickerSymbol, "securityName": securityName
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadSecurityTable();
      }
    };
  }

  function editSecurity(tickerSymbol) {
    console.log(tickerSymbol);
    Swal.fire({
        title: 'Edit Security',
        html:
          '<input id="id" type="hidden">' +
          '<input id="tickerSymbol" class="swal2-input" placeholder="Ticker Symbol">' +
          '<input id="securityName" class="swal2-input" placeholder="Security Name">',
        focusConfirm: false,
        preConfirm: () => {
            const tickerSymbol = document.getElementById("tickerSymbol").value;
            const securityName = document.getElementById("securityName").value;
            const xhttp = new XMLHttpRequest();
            xhttp.open("PATCH", "https://smallcase-portfolio-api-avik.herokuapp.com/api/security/update/"+tickerSymbol);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify({
                "tickerSymbol": tickerSymbol, "securityName": securityName
            }));
            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    const objects = JSON.parse(this.responseText);
                    Swal.fire(objects['message']);
                    loadSecurityTable();
                  }
            }
        }
      })
    };

function deleteSecurity(tickerSymbol) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "https://smallcase-portfolio-api-avik.herokuapp.com/api/security/remove/" + tickerSymbol);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({ 
            "tickerSymbol": tickerSymbol
        }));
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(objects['message']);
            loadSecurityTable();
            loadTradeTable();
            loadPortfolioTable();
        } 
    };
}


  function loadTradeTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://smallcase-portfolio-api-avik.herokuapp.com/api/trade/fetch");
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        const values = Object.values(objects);
        var counter = 1;
        for(var i=0;i<values.length;i++)
        {
            if(values[i].length > 0)
            {
                for(var j=0;j<values[i].length;j++)
                {
                    trHTML += '<tr>';
                    trHTML += '<td>' + counter + '</td>';
                    trHTML += '<td>' + values[i][j]['tradeId'] + '</td>';
                    trHTML += '<td>' + values[i][j]['tickerSymbol'] + '</td>';
                    trHTML += '<td>' + values[i][j]['unitPrice'] + '</td>';
                    trHTML += '<td>' + values[i][j]['quantity'] + '</td>';
                    trHTML += '<td>' + values[i][j]['tradeType'] + '</td>';
                    trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="editTrade(\''+values[i][j]['tradeId']+'\')">Edit</button>';
                    trHTML += '<button type="button" class="btn btn-outline-danger" onclick="deleteTrade(\''+values[i][j]['tradeId']+'\')">Del</button></td>';
                    trHTML += '</tr>';
                    counter++;
                }
            }
        }
        document.getElementById("trade-table").innerHTML = trHTML;
      }
    };
  }

  function showTradeCreationBox() {
    Swal.fire({
      title: 'Add Trade',
      html:
        '<input id="id" type="hidden">' +
        '<input id="tickerSymbol" class="swal2-input" placeholder="Ticker Symbol">' +
        '<input id="unitPrice" class="swal2-input" placeholder="Unit Price">'+
        '<input id="quantity" class="swal2-input" placeholder="Quantity">'+
        '<input id="tradeType" class="swal2-input" placeholder="Trade Type(either Buy or Sell)">',
      focusConfirm: false,
      preConfirm: () => {
        tradeCreate();
      }
    })
  }
  
  function tradeCreate() {
    const tickerSymbol = document.getElementById("tickerSymbol").value;
    const unitPrice = document.getElementById("unitPrice").value;
    const quantity = document.getElementById("quantity").value;
    const tradeType = document.getElementById("tradeType").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://smallcase-portfolio-api-avik.herokuapp.com/api/trade/add");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "tickerSymbol": tickerSymbol, "unitPrice": parseInt(unitPrice),
      "quantity": parseInt(quantity), "tradeType": tradeType
    }));
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTradeTable();
        loadPortfolioTable();
      }
    };
  }

  function editTrade(tradeId) {
    console.log(tradeId);
    Swal.fire({
        title: 'Edit Trade',
        html:
            '<input id="id" type="hidden">' +
            '<input id="tickerSymbol" class="swal2-input" placeholder="Ticker Symbol">' +
            '<input id="unitPrice" class="swal2-input" placeholder="Unit Price">'+
            '<input id="quantity" class="swal2-input" placeholder="Quantity">'+
            '<input id="tradeType" class="swal2-input" placeholder="Trade Type(either Buy or Sell)">',
        focusConfirm: false,
        preConfirm: () => {
            const tickerSymbol = document.getElementById("tickerSymbol").value;
            const unitPrice = document.getElementById("unitPrice").value;
            const quantity = document.getElementById("quantity").value;
            const tradeType = document.getElementById("tradeType").value;
            const xhttp = new XMLHttpRequest();
            xhttp.open("PATCH", "https://smallcase-portfolio-api-avik.herokuapp.com/api/trade/update/"+tradeId);
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify({ 
                "tickerSymbol": tickerSymbol, "unitPrice": parseInt(unitPrice),
                "quantity": parseInt(quantity), "tradeType": tradeType
              }));
            xhttp.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200) {
                    const objects = JSON.parse(this.responseText);
                    Swal.fire(objects['message']);
                    loadTradeTable();
                    loadPortfolioTable();
                  }
            }
        }
      })
    };

    function deleteTrade(tradeId){
        const xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "https://smallcase-portfolio-api-avik.herokuapp.com/api/trade/remove/" + tradeId);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify({ 
        "tradeId": tradeId
        }));
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(objects['message']);
            loadTradeTable();
            loadPortfolioTable();
        } 
        };
    }

  
  loadPortfolioTable();
  loadSecurityTable();
  loadTradeTable();