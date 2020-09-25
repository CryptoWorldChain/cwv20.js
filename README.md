### brewchain.js
-----------------------

### Install

```
$ npm install brewchain.js
```

### Super simple to use

Setting up the network,brewchain.js support network has testnet and prodnet
```js
const brew=require('brewchain.js');
var rp = require('request-promise')
//set prodnet network
brew.config.server_base='http://rc.domain.com/fbs';
brew.config.net_type='prodnet'
brew.config.rpc_provider = rp;
```

Create keystore.json、keypair
```java
const brew=require('brewchain.js');
const fs=require('fs');
var kp = brew.KeyPair.genRandomKey();
/**
* create keystore
* @param {*} kp
* @param {*} password
*/
var json = brew.keystore.exportJSON(kp,"000000");
let fd = fs.openSync('keystore.json', 'w+');
fs.writeSync(fd,JSON.stringify(json));
console.log('keypair',kp);
```

Get balance and nonce
```js
const brew=require('brewchain.js');
/**
* get balance and nonce
* @param {*} address
*/
brew.rpc.getBalance('8f3aa4f0f35ff81ba487f91f6b980c0ba2562245').then(function(result){
    console.log(result.account.balance)
    console.log(result.account.nonce)
})
```

Get block info by hash
```js
const brew=require('brewchain.js');
/**
* get block info by hash
* @param {*} blockhash
*/
brew.rpc.getBlockByHash('03a15d84e6e29d2affab1ddc680f0aefc20586bd73ea3d81dcf6505924cfb86c').then(function(result){
    console.log(result)
})
```
Get block info by height
```js
const brew=require('brewchain.js');
/**
* get block info by height
* @param {*} height
*/
brew.rpc.getBlockByNumber('1518059').then(function(result){
    console.log(result)
})
```
Get the current height of the BREW blockchain
```js
const brew=require('brewchain.js');
brew.rpc.getBlockByMax().then(function(result){
    console.log(result)
})
```

Get transaction information through transaction hash
```js
const brew=require('brewchain.js');
/**
* get transaction information
* @param {*} transactionhash
*/
brew.rpc.getTransaction('f9bea09140e8e2eb2956976c3373418e2a935d821732d86bce33117d17314088').then(function(result){
    console.log(result)
})
```

Send transfer，support balance transfer，token transfer， crypto token transfer 。

```js
const brew=require('brewchain.js');
/**
* get keystore by prikey
* @param {*} prikey
*/
var kp = brew.KeyPair.genFromPrikey(
  '89611e9ed751b2bb0f2a84d1b364bd6ef97a512a7ad0b1b50241168ff3add985')
  
/**
* transfer
* @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
* @param {*} exdata "hexstring"
* @param {*} args [{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":""}]
*/
kp.nonce=10;
var from={keypair:kp};
var args=[{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":1}]
var exdata=""
brew.rpc.transfer(from,extdata,args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign transfer
```js
/**
 * sign transfer 
 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
 * @param {*} token
 * @param {*} args {"tos":["",""], "values":["",""]} 
 * @result {"tx":tx}
 */
//only get sign
var sign = brew.rpc.signTransfer(from,extdata,args);
```

Create a token transaction
```js
/**
* create token
* @param {*} from {"keypair":{"address":"","privateKey":"", "nonce": 0}}
* @param {*} exdata "hexstring"
* @param {*} args {"tos":["",""], "values":["",""],"name":"","symbol":"","decimals":18}
*/
brew.rpc.createToken(from,exdata args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign create token
```js
/**
* create token
* @param {*} from {"keypair":{"address":"","privateKey":"", "nonce": 0}}
* @param {*} exdata "hexstring"
* @param {*} args {"tos":["",""], "values":["",""],"name":"","symbol":"","decimals":18} 
* @result {"tx":tx}
*/
//only get sign
var sign = brew.rpc.signCreateToken(from,extdata,args);
```

Transfer token transaction
```js
/**
 * transfer token 
 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
 * @param {*} token
 * @param {*} args {"tos":["",""], "values":["",""]} 
 */
brew.rpc.transferToken(from,token,args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign transfer token
```js
/**
 * transfer token 
 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
 * @param {*} token
 * @param {*} args {"tos":["",""], "values":["",""]} 
 * @result {"tx":tx}
 */
var sign = brew.rpc.signTransferToken(from,extdata,args);
```

Create contract

```js
/**
* create contract
* @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
* @param {*} exdata "hexstring"
* @param {*} args {"data":"hexstring"}
*/
brew.rpc.createContract(from,exdata,args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign Create contract
```js
/**
* create contract
* @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
* @param {*} exdata "hexstring"
* @param {*} args {"data":"hexstring"}
* @result {"tx":tx}
*/
var sign = brew.rpc.signCreateContract(from,extdata,args);
```

Call contract
```js
/**
 * call contract
 * @param {*} from 
 * @param {*} exdata
 * @param {*} args {"contract":"", "data":"hexstring", "amount":""}
*/

brew.rpc.callContract(from,exdata,args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign Call contract
```js
/**
 * call contract
 * @param {*} from 
 * @param {*} exdata
 * @param {*} args {"contract":"", "data":"hexstring", "amount":""}
 * @result {"tx":tx}
*/
var sign = brew.rpc.signCallContract(from,extdata,args);
```
### License

MIT
