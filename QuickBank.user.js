// ==UserScript==
// @name         QuickBank
// @namespace    cruci4l.quickbank
// @version      0.1.1
// @description  A quick way to dump and pull your money for Torn City
// @author       cRuci4L
// @match        https://www.torn.com/*
// @updateURL    https://github.com/cRuci4L/QuickBank/raw/main/QuickBank.user.js
// @downloadURL  https://github.com/cRuci4L/QuickBank/raw/main/QuickBank.user.js
// @grant        none

// ==/UserScript==

//********SET YOUR TRADE ID HERE***********
const myTradeID = ''

//custom withdrawal amount in millions
const customAmount = ["don't touch", "don't touch", 2, 10, 50, 100]

//*****************************************

//API STUFFS
let qb_apikey = localStorage.getItem('qb_apikey');
if (qb_apikey === 'null') {
  localStorage.removeItem('qb_apikey');
  qb_apikey = null;
}

if (!qb_apikey) {
  qb_apikey = window.prompt('[QuickBank] Please enter your Torn API key:');
  localStorage.setItem('qb_apikey', qb_apikey);
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'c' && event.ctrlKey && event.altKey) {
    localStorage.removeItem('qb_apikey');
    alert('Api key removed from local storage');
  }
});

//CSS
const buttonStyle = document.createElement('style');
buttonStyle.innerHTML = `
    button:hover{
        -webkit-transform: scale(1.1);
        -ms-transform: scale(1.1);
        transform: scale(1.1);
    }
`;

//Add top button links on page load
window.onload = function() {
  const myDiv = document.querySelectorAll(".menu-item-link")
  const myList = ["Dump", "Get All", `${customAmount[2]}m`, `${customAmount[3]}m`, `${customAmount[4]}m`, `${customAmount[5]}m`]
  const myColors = ["#c96a31", "#48711e", "#48711e", "#48711e", "#48711e", "#48711e"]
  for (let i = 0; i < myDiv.length; i++) {

      myDiv[i].innerHTML = `<span style=" background-color: ${myColors[i]}; border-radius: 2px; border: none; margin: 0px 3px 0px 3px"><button id="myButton${[i]}" style="color: white; font-size: 12px; padding: 0px; margin: 0px 3px 0px 3px">${myList[i]}</button></span>`
  }
  // Add the event listeners here
  document.getElementById("myButton0").addEventListener("click", () => moneyStuffs(0));
  document.getElementById("myButton1").addEventListener("click", () => moneyStuffs(1));
  document.getElementById("myButton2").addEventListener("click", () => moneyStuffs(2));
  document.getElementById("myButton3").addEventListener("click", () => moneyStuffs(3));
  document.getElementById("myButton4").addEventListener("click", () => moneyStuffs(4));
  document.getElementById("myButton5").addEventListener("click", () => moneyStuffs(5));
};

var count = 0
var handMoney = null
var totalMoney = 0


// Add the button:hover CSS to the head of the document
document.head.appendChild(buttonStyle);

async function moneyStuffs(elem) {
    handMoney = parseInt(document.getElementById('user-money').textContent.slice(1).replace(/,/g, ''));
    count = 0

    if (elem == 0) {
        try {
            const response = await apiPull();
            const tradeMoney = response;
            const totalMoney = tradeMoney + handMoney;

            let temp = window.open(`https://www.torn.com/trade.php#step=view&sub_step=addmoney2&ID=${myTradeID}&amount=${totalMoney}`, "_blank")
            temp.addEventListener('load', function () {
                temp.close();
            }, false);
        } catch (error) {
            console.error(error);
        }
    }

    if (elem == 1) {
        var temp = window.open(`https://www.torn.com/trade.php#step=view&sub_step=addmoney2&ID=${myTradeID}&amount=0`, "_blank")
        temp.addEventListener('load', function () {
            temp.close();
        }, false);
    }

    if (elem >= 2 && elem <= 5) {
        console.log(handMoney)
        try {
            const response = await apiPull();
            const deduction = customAmount[elem] * 1000000
            console.log(`Money in trade:${response}, Money on hand:${handMoney}, Deducation:${deduction}`)

            totalMoney = response + handMoney - (handMoney + deduction);

            let temp = window.open(`https://www.torn.com/trade.php#step=view&sub_step=addmoney2&ID=${myTradeID}&amount=${totalMoney}`, "_blank")
            temp.addEventListener('load', function () {
                temp.close();
            }, false);
        } catch (error) {
            console.error(error);
        }
    }
}




async function apiPull() {
    try {
        const tradeRes = await fetch(`https://api.torn.com/user/?selections=log&log=4442,4443&key=${qb_apikey}&comment=QuickBank`)
        const tradeJson = await tradeRes.json();
        let response = null

        Object.entries(tradeJson.log).forEach(([key, value]) => {
            const tradeID = tradeJson.log[key].data.trade_id.slice(36).slice(0, -27)
            const tradeMoney = tradeJson.log[key].data.total
            if (tradeID == myTradeID && count < 1) {
                count = count + 1
                response = tradeMoney
            }
        })
        return response;
    } catch (error) {
        return "Error: " + error.message;
    }
}





