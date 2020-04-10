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
//set testnet network type
brew.config.server_base='http://rc.fclink.cn:38000/fbs';
brew.config.net_type='testnet'
//set prodnet network type
brew.config.server_base='http://rc.fclink.cn/block';
brew.config.net_type='prodnet'
brew.config.rpc_provider = rp;
```

Get balance and nonce
```js
const brew=require('brewchain.js');
brew.rpc.getBalance('8f3aa4f0f35ff81ba487f91f6b980c0ba2562245').then(function(result){
    console.log(result.account.balance)
    console.log(result.account.nonce)
})
```

Get block info by hash
```js
const brew=require('brewchain.js');
brew.rpc.getBlockByHash('03a15d84e6e29d2affab1ddc680f0aefc20586bd73ea3d81dcf6505924cfb86c').then(function(result){
    console.log(result)
})
```
Get block info by height
```js
const brew=require('brewchain.js');
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

Create keystore.json、keypair

```java
const brew=require('brewchain.js');
const fs=require('fs');
var kp = brew.KeyPair.genRandomKey();
var json = keystore.exportJSON(kp,"000000");
let fd = fs.openSync('keystore.json', 'w+');
fs.writeSync(fd,JSON.stringify(json));
console.log('keypair',kp);
```

Send transfer，support balance transfer，token transfer， crypto token transfer 。

```js
const brew=require('brewchain.js');
var kp = brew.KeyPair.genFromPrikey(
  '89611e9ed751b2bb0f2a84d1b364bd6ef97a512a7ad0b1b50241168ff3add985')
/**
* transfer
* @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
* @param {*} exdata Plaintext
* @param {*} args 
* 	transfer balance
* 	args=[{"address":"","amount":100},{"address":"", "amount":"20"}]
* 
* 	transfer token
* 	args=[
* 		{"address":"","token":"AAA","tokenAmount":"1000"},
* 		{"address":"","token":"AAA","tokenAmount":"2000"}
*		]
* 
* 	transfer crc721 token
* 	args=[
* 		{"address":"","symbol":"house","cryptoToken":["hash0","hash1"]},
* 		{"address":"","symbol":"house","cryptoToken":["hash2","hash3"]}
* 	]
*/
kp.nonce=10;
var from={keypair:kp};
var args=[{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":1}]
brew.rpc.transfer(from,exdata,args).then(function(result){
    console.log(result)
})
```

Get transaction information through transaction hash
```js
const brew=require('brewchain.js');
brew.rpc.getTransaction('f9bea09140e8e2eb2956976c3373418e2a935d821732d86bce33117d17314088').then(function(result){
    console.log(result)
})
```

Create a token transaction
```js
const brew=require('brewchain.js');
/**
* create token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"token":"AAA", "amount":"10000000000000000000000000000","opCode":0}
*/
brew.rpc.publicToken(from, exdata, args).then(function(result){
    console.log(result)
})
```
Burn a token transaction

```js
const brew=require('brewchain.js');
/**
* burn token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"token":"AAA", "amount":"10000000000000000000000000000","opCode":1}
*/
brew.rpc.burnToken(from,exdata,args).then(function(result){
    console.log(result)
})
```

Additional a token transaction

```java
const brew=require('brewchain.js');
/**
* Additional token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"token":"AAA", "amount":"10000000000000000000000000000","opCode":2}
*/
brew.rpc.mintToken(from,exdata,args).then(function(result){
    console.log(result)
})
```

Create contract

```js
const brew=require('brewchain.js');
/**
* createContract
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"data":"", "amount":""}
*/
brew.rpc.createContract(from,exdata,args).then(function(result){
    console.log(result)
})
```

Call contract

```js
const brew=require('brewchain.js');
/**
* callContract
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"contract":"", "data":"", "amount":""}
*/
brew.rpc.callContract(from,exdata,args).then(function(result){
    console.log(result)
})
```

Create crc721 token transaction
```js
const brew=require('brewchain.js');
/**
* create CRC721 token
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} exdata Plaintext
* @param {*} args {"total":10, "symbol":"", "code":"","name":"",key:[],value:[]}
*/
brew.rpc.createCrypto(from,exdata,args).then(function(result){
    console.log(result)
})
```
signEvfsFileUpload sign

```js
const brew=require('brewchain.js');
/**
* get evfs file upload sign
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} args {"evfs":""}
*/


var result=brew.rpc.signEvfsFileUpload(from, exdata, args)

Return structure
{
    tx:""
}
```

signEvfsAuthFile

```js
const brew=require('brewchain.js');
/**
* get evfs auth sign
* @param {*} from {"keypair":{"address":"","privateKey":""}, "nonce": 0}
* @param {*} args {"fileHash":"","addAddrs":["",""]}  //add auth list
									{"fileHash":"","removeAddrs":["",""]} //remove auth list
*/
var result=brew.rpc.signEvfsAuthFile(from, exdata, args)

Return structure
{
    tx:""
}
```

signCustom

```java
const brew=require('brewchain.js');
/**
* get evfs auth sign
* @param {*} from {"keypair":{"address":"","privateKey":""}}
* @param {*} args {data:""}
*/
brew.rpc.signCustom(from, exdata, args)
```



### License

MIT
