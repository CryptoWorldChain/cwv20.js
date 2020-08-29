const chain=require('./dist/brewchain.js');
const fs=require('fs');
var rp = require('request-promise')

var BN=require('bn.js');
//set testnet network type
chain.config.server_base='http://c0:8000/fbs';
chain.config.rpc_provider = rp;

// 3c1ea4aa4974d92e0eabd5d024772af3762720a0  79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51
// 533a5a084cd587c86c20a0ddfb28f9ad018f341a  84a8d84288b9db81083004b0cf70ac02e696760207d689d9a4e1a773ebf80264
// c60042d114c2a1ba13e154f446badf8e152a923f  3f1caff94cc871ae796c61ddbf360e0bd515eb26047215634e7386e4a1ea0ab8
// ee155386bf40a7d55f0bef92743adc0c8fb0683c  565ab31d16d4b8bc408ab5ce84ef265f58f337c20386f3dfdc7eb6fe9aad5280
// 97f1bd5e9cae1d7f52bbb2818d80c8ca9392215b  ac289f69fad7a5a86b90e1518877d9919d1ee2ff84a4210d5e081823e7ceb9ba

// 测试链默认有钱的 3c1ea4aa4974d92e0eabd5d024772af3762720a0  79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51

var kp = chain.KeyPair.genFromPrikey('ac289f69fad7a5a86b90e1518877d9919d1ee2ff84a4210d5e081823e7ceb9ba')
// var kp=chain.KeyPair.genRandomKey()
var from={
    keypair:kp
}

console.log(from)

chain.rpc.getBalance(from.keypair.hexAddress).then(function(result){
    // ************************1.transfer************************
    result=JSON.parse(result);
    from.keypair.nonce=result.nonce;
    // var args=[{"address":"6e1a9a64f3bd915270d1a12b1f448b8f4dd36071","amount":"1000000000000000000000000"},
    // {"address":"ee155386bf40a7d55f0bef92743adc0c8fb0683c","amount":"1000000000000000000000000"}]
    // chain.rpc.transfer(from,null,args).then(function(result){
    //     console.log(result)
    // })
    // console.log(from)
    // ************************2.createContract************************
    var cvm = "608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636057361d14604e578063b05784b8146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a72305820932e47aec0222dc95d62713ff319c47ef736ebffa72eadb17185eadfd6adaa180029";
    args={"data":cvm};
    chain.rpc.createContract(from,null,args).then(function(result){
        console.log("cvm:"+result)
    }).catch(function(error){
        console.log("error==="+error);
    })

    // args={"contract":"0x1c81566438e4f089f893557379ba9332450beb3d","data":"6057361d0000000000000000000000000000000000000000000000000000000000002710"}
    // chain.rpc.callContract(from,null,args).then(function(result){
    //     console.log(result)
    // }).catch(function(error){
    //     console.log(error);
    // })
    // ************************2.createToken************************
    // from.keypair.nonce=result.nonce;
    // args={"tos":["a5c31be225011ee6ecceaf3b9b3696db01a20d6c",'97f1bd5e9cae1d7f52bbb2818d80c8ca9392215b'], 
    // "values":["100000000000000000000","200000000000000000000"],"name":"CCC","symbol":"CCC","decimals":18,
    // "ext_datas":Buffer.from(JSON.stringify({"c":"2"}),"utf8").toString("hex")} 
    // chain.rpc.createToken(from,null,args).then(function(result){
    //     console.log(result);
    // }).catch(function(error){
    //     console.log("error==="+error);
    // })
    // token="0x77fcd28a595cc528e9f8293e79a01c2dee7e20ab";
    // args={"tos":["3c1ea4aa4974d92e0eabd5d024772af3762720a0"], "values":["1000000000000000000"]} 
    // chain.rpc.transferToken(from,token,args).then(function(result){
    //     console.log(result)
    // }).catch(function(error){
    //     console.log(error);
    // })

}).catch(function (err) {
    console.log(err)
});

// console.log(chain.rpc.sign(from,args))

// ************************3.getTransaction************************
// chain.rpc.getTransaction('c5a807a17a9c85d8d1895aa92bf94ba35ceb8b80a039110804531e06bfcfbe34a6').then(function(result){
//     console.log(result)
// })

// String hexStr = "706172616d6574657220696e76616c69642c2073656e646572206e6f6e6365206973206c61726765207468616e207472616e73616374696f6e206e6f6e6365";
//   byte[] bytes = crypto.hexStrToBytes(hexStr);
//   String str= new String(bytes);
//   System.out.println(str);


var hex='0x657865636572726f723a62616c616e6365206f66207468652073656e646572206973206e6f7420656e6f75676820746f207472616e7366657220746f6b656e202c6e6565643a30783861633732333034383965383030303020686176653a30';

// 16进制转字符串
function hex2str(hex) {
　　var trimedStr = hex.trim();
　　var rawStr = trimedStr.substr(0,2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
　　var len = rawStr.length;
　　if(len % 2 !== 0) {
　　　　alert("Illegal Format ASCII Code!");
　　　　return "";
　　}
　　var curCharCode;
　　var resultStr = [];
　　for(var i = 0; i < len;i = i + 2) {
　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16);
　　　　resultStr.push(String.fromCharCode(curCharCode));
　　}
　　return resultStr.join("");
}
console.log(hex2str(hex))

