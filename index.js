 function log(message) {
   document.getElementById("log").innerHTML=message;
    console.log(message);
  }
  function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }
      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }
 function initMessages() {
    secureChat.messagesLength((err, maxMessages) => {
        let sectionContent = ''
        maxMessages = maxMessages.toNumber()
        for(let i = 0; i < maxMessages; i++) {
            secureChat.getMessage(i, (err, message) => {
                sectionContent += `<div class="message-box">
                    <div>${message[2]}</div>
                    <div>${message[0]} says:</div>
                    <div>${message[1]}</div>
                    <div id="msgTimestamp">Sent On: ${message[3]}</div>
                </div>`

                if(i === maxMessages - 1) document.querySelector('#messages').innerHTML = sectionContent
            })
        }
    })
}
 const address = "0x7670dCe4Ac769d5ee5D6f52C29909b0b55C44c60";
  const abi = [{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"createAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMyName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getMessage","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"_content","type":"string"}],"name":"writeMessage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"messagesLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
  secureChat = web3.eth.contract(abi).at(address);
  $(function () {
    var secureChat;
    $('#myProfile').click( function (e) {
      e.preventDefault();
      secureChat.getMyName.call( function (err, result1) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getName").innerHTML = result1;
      });
    });
    $('#myProfile').click(function (e) {
      e.preventDefault();
      secureChat.getMyAddress.call( function (err, result1) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("getAddress").innerHTML = result1;
      });
    });
    $('#createAccount').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      secureChat.createAccount.sendTransaction(document.getElementById("name").value, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Ok, Start Having Fun...");
        });
      });
    });
    $('#sendMessage').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      secureChat.writeMessage.sendTransaction(document.getElementById("address").value, document.getElementById("write-message").value, function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Message Sent.");
        });
      });
    });
    if (typeof(web3) === "undefined") {
      error("Unable to find web3. " +
            "Please run MetaMask (or something else that injects web3).");
    } else {
      log("Found injected web3.");
      web3 = new Web3(web3.currentProvider);
      ethereum.enable();
      if (web3.version.network != 3) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        secureChat = web3.eth.contract(abi).at(address);
        $("#refresh").click();
        $("#myProfile").click();

        }
    }
  });
