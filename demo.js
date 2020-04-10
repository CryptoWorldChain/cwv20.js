const chain=require('./dist/brewchain.js');
const fs=require('fs');
var rp = require('request-promise')
//set testnet network type
chain.config.server_base='http://43.254.1.176:8000/fbs';
chain.config.rpc_provider = rp;


// hexPrikey: '7f38bce241536c1725b2179e5d59328c04e7735f8fbfccb7acf33cf05cacf6fc',
// hexPubkey: '950ac202790ea5a2b2d008445f7effae5e1ec2a13a6fc748c1d25fc3dfc2ab55137a385d18813032ff96c8aa6612eabb8a44bd9ac16e7e2976b0bfbf4cf493e6',
// hexAddress: 'fbcbd881eae57ae3542dc1baa2dc6e68ec9ce18a',

var kp=chain.KeyPair.genRandomKey();
// console.log(kp);

// var kp = cwv.KeyPair.genFromPrikey('f768fb807e803fea9dfd434329e4bd6d7277afde4c3336d0e1413e304c587e2e')
// var kp = cwv.KeyPair.genFromPrikey('6b5e7ff06889bd3acea83d81a79eccef5cc0c02d2085fe70d07f6257fc3d0eec')
// var kp=cwv.KeyPair.genRandomKey();
// var kp = cwv.KeyPair.genFromPrikey('fa626690bf525b4652e03be9a8bea4d807c4ae56102904b06fd8ed19b2e7138e')
kp.nonce=1;
var from={
    keypair:kp
}


console.log(from)

// chain.rpc.getBalance('9a82cd3be67c011aca4a03040261b856185f0228').then(function(result){
//     console.log(result);
// }).catch(function (err) {
//     console.log(err)
// });
var args=[{"address":"a5c31be225011ee6ecceaf3b9b3696db01a20d6c","amount":"0"}]
chain.rpc.transfer(from,args).then(function(result){
    console.log(result)
})

chain.rpc.getBalance("a5c31be225011ee6ecceaf3b9b3696db01a20d6c").then(function(result){
    console.log(result)
})
