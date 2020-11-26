### brewchain.js
-----------------------

### Super simple to use

Setting up the network,brewchain.js support network has testnet and prodnet

```js script
<script src="bip44.js" type="text/javascript" charset="utf-8"></script>
<script src="brewchain-browser.js"></script>
<script>
    chain.default.config.server_base='http://rc.domain.com/fbs';
    var mnemonic = bip44.generateMnemonic(null, null, bip44.wordlists.english);
    var base58 = bip44.mnemonicToHDPrivateKey(mnemonic, null)
    console.log("mnemonicToHDPrivateKey="+base58);
    var pk = bip44.getPrivateKey(base58, 0);
    console.log("pk="+pk);
    var obj = chain.default.KeyPair.genFromPrikey(pk)
</script>
```

Get balance and nonce
```js
/**
* get balance and nonce
* @param {*} address
* @result {
        "retCode": 1,
        "address": "0x46f1f188bca9c555464ab41daecffaa0405f177c",
        "nonce": 0,//nonce
        "balance": "0x21e19e0c9bab2400000",//16进制余额
        "status": 0
    } 
*/
chain.default.rpc.getBalance('8f3aa4f0f35ff81ba487f91f6b980c0ba2562245').then(function(result){
    console.log(result.account.balance)
    console.log(result.account.nonce)
})
```

Get block info by hash
```js
/**
* get block info by hash
* @param {*} blockhash
*/
chain.default.rpc.getBlockByHash('03a15d84e6e29d2affab1ddc680f0aefc20586bd73ea3d81dcf6505924cfb86c').then(function(result){
    console.log(result)
})
```
Get block info by height
```js
/**
* get block info by height
* @param {*} height
*/
chain.default.rpc.getBlockByNumber('1518059').then(function(result){
    console.log(result)
})
```
Get the current height of the BREW blockchain
```js
chain.default.rpc.getBlockByMax().then(function(result){
    console.log(result)
})
```

Get transaction information through transaction hash
```js
/**
* get transaction information
* @param {*} transactionhash
*/
chain.default.rpc.getTransaction('f9bea09140e8e2eb2956976c3373418e2a935d821732d86bce33117d17314088').then(function(result){
    console.log(result)
})
```

Send transfer，support balance transfer，token transfer， crypto token transfer 。

```js
/**
* get keystore by prikey
* @param {*} prikey
*/
var kp = chain.default.KeyPair.genFromPrikey(
  '89611e9ed751b2bb0f2a84d1b364bd6ef97a512a7ad0b1b50241168ff3add985')
  
/**
* transfer
* @param {*} from {"keypair":{"hexAddress":"","privateKey":"",nonce:10}}
* @param {*} exdata "hexstring"
* @param {*} args [{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":""}]
* @result {*}
 *  {
 *      "retCode": 1, //1=成功 0=失败
 *      "hash": "70d994369495f2139102a8391e463418d0f6d62e4a2e1444949f3eba2e1ebf74b7"//交易hash
 *  }
*/
kp.nonce=10;
kp.hexAddress=chain.default.rpc.removeCVN(kp.hexAddress);
var from={keypair:kp};

var args=[{"address":chain.default.rpc.removeCVN("066c03fcc3048863f72b051530e5a212fb9233f6"),"amount":1}]
var exdata=""
chain.default.rpc.transfer(from,extdata,args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign transfer
```js
/**
* transfer
* @param {*} from {"keypair":{"hexAddress":"","privateKey":"",nonce:10}}
* @param {*} exdata "hexstring"
* @param {*} args [{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":""}]
 * @result {"tx":tx}
 */
//only get sign
var sign = chain.default.rpc.signTransfer(from,extdata,args);
```

Create a token transaction
```js
/**
* create token
* @param {*} from {"keypair":{"hexAddress":"","privateKey":"", "nonce": 0}}
* @param {*} exdata "hexstring"
* @param {*} args {"tos":["",""], "values":["",""],"name":"","symbol":"","decimals":18}
* @result {*}
 *  {
 *      "retCode": 1, //1=成功 0=失败
 *      "hash": "70d994369495f2139102a8391e463418d0f6d62e4a2e1444949f3eba2e1ebf74b7"//交易hash
 *  }
*/
chain.default.rpc.createToken(from,exdata args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign create token
```js
/**
* create token
* @param {*} from {"keypair":{"hexAddress":"","privateKey":"", "nonce": 0}}
* @param {*} exdata "hexstring"
* @param {*} args {"tos":["",""], "values":["",""],"name":"","symbol":"","decimals":18} 
* @result {"tx":tx}
*/
//only get sign
var sign = chain.default.rpc.signCreateToken(from,extdata,args);
```

Transfer token transaction
```js
/**
 * transfer token 
 * @param {*} from {"keypair":{"hexAddress":"","privateKey":"",nonce:10}}
 * @param {*} token
 * @param {*} args {"tos":["",""], "values":["",""]} 
 * @result {*}
 *  {
 *      "retCode": 1, //1=成功 0=失败
 *      "hash": "70d994369495f2139102a8391e463418d0f6d62e4a2e1444949f3eba2e1ebf74b7"//交易hash
 *  }
 */
chain.default.rpc.transferToken(from,token,args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign transfer token
```js
/**
 * transfer token 
 * @param {*} from {"keypair":{"hexAddress":"","privateKey":"",nonce:10}}
 * @param {*} token
 * @param {*} args {"tos":["",""], "values":["",""]} 
 * @result {"tx":tx}
 */
var sign = chain.default.rpc.signTransferToken(from,token,args);
```

Create contract

```js
/**
* create contract
* @param {*} from {"keypair":{"hexAddress":"","privateKey":"",nonce:10}}
* @param {*} exdata "hexstring"
* @param {*} args {"data":"hexstring"}
* @result {*} 
 *  {
 *      "retCode": 1, //1=成功 0=失败
 *      "hash": "70d994369495f2139102a8391e463418d0f6d62e4a2e1444949f3eba2e1ebf74b7"//交易hash
 *      "contractHash":""//合约地址 ,其他交易无此参数
 *  }
*/
chain.default.rpc.createContract(from,exdata,args).then(function(result){
    console.log(result)
}).catch(function(error){
    console.log(error);
})
```

sign Create contract
```js
/**
* create contract
* @param {*} from {"keypair":{"hexAddress":"","privateKey":"",nonce:10}}
* @param {*} exdata "hexstring"
* @param {*} args {"data":"hexstring"}
* @result {"tx":tx}
*/
var sign = chain.default.rpc.signCreateContract(from,extdata,args);
```

Call contract
```js
/**
 * call contract
 * @param {*} from 
 * @param {*} exdata
 * @param {*} args {"contract":"", "data":"hexstring", "amount":""}
 * @result {*}
 *  {
 *      "retCode": 1, //1=成功 0=失败
 *      "hash": "70d994369495f2139102a8391e463418d0f6d62e4a2e1444949f3eba2e1ebf74b7"//交易hash
 *  }
*/

chain.default.rpc.callContract(from,exdata,args).then(function(result){
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
var sign = chain.default.rpc.signCallContract(from,extdata,args);
```
### License

MIT
