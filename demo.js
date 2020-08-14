const chain=require('./dist/brewchain.js');
const fs=require('fs');
var rp = require('request-promise')

var BN=require('bn.js');
//set testnet network type
chain.config.server_base='http://127.0.0.1:8000/fbs';
chain.config.rpc_provider = rp;

// 3c1ea4aa4974d92e0eabd5d024772af3762720a0  79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51
// 533a5a084cd587c86c20a0ddfb28f9ad018f341a  84a8d84288b9db81083004b0cf70ac02e696760207d689d9a4e1a773ebf80264
// c60042d114c2a1ba13e154f446badf8e152a923f  3f1caff94cc871ae796c61ddbf360e0bd515eb26047215634e7386e4a1ea0ab8
// ee155386bf40a7d55f0bef92743adc0c8fb0683c  565ab31d16d4b8bc408ab5ce84ef265f58f337c20386f3dfdc7eb6fe9aad5280
// 97f1bd5e9cae1d7f52bbb2818d80c8ca9392215b  ac289f69fad7a5a86b90e1518877d9919d1ee2ff84a4210d5e081823e7ceb9ba

// 测试链默认有钱的 3c1ea4aa4974d92e0eabd5d024772af3762720a0  79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51

var kp = chain.KeyPair.genFromPrikey('79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51')
// var kp=chain.KeyPair.genRandomKey()
var from={
    keypair:kp
}

console.log(from)

chain.rpc.getBalance(from.keypair.hexAddress).then(function(result){
    // ************************1.transfer************************
    result=JSON.parse(result);
    from.keypair.nonce=result.nonce;
    // var args=[{"address":"97f1bd5e9cae1d7f52bbb2818d80c8ca9392215b","amount":"-1000000000000000000"}]
    // chain.rpc.transfer(from,args).then(function(result){
    //     console.log(result)
    // })

    // ************************2.createContract************************
    // var cvm = "6080604052600060015534801561001557600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610174806100656000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633fa4f2451461005c57806364a4635c14610087578063a74c2bb6146100b4575b600080fd5b34801561006857600080fd5b5061007161010b565b6040518082815260200191505060405180910390f35b34801561009357600080fd5b506100b260048036038101908080359060200190929190505050610111565b005b3480156100c057600080fd5b506100c961011f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60015481565b806001540160018190555050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050905600a165627a7a72305820e58cd47f3736b6239ce4a0c9b59e0bad69c4420c5fcfab6500226f7198be8d2a0029";
    // args={"data":cvm};
    // chain.rpc.createContract(from,args).then(function(result){
    //     console.log("cvm:"+result)
    // }).catch(function(error){
    //     console.log("error==="+error);
    // })

    // ************************2.createToken************************
    from.keypair.nonce=result.nonce;
    args={"tos":["a5c31be225011ee6ecceaf3b9b3696db01a20d6c"], "values":["0x10"],"name":"AAA","symbol":"AAA","decimals":18,"ext_datas":Buffer.from(JSON.stringify({"c":"2"}),"utf8").toString("hex")} 
    chain.rpc.createToken(from,args).then(function(result){
        console.log(result);
    }).catch(function(error){
        console.log("error==="+error);
    })

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


var hex='0x657865636572726f723a62616c616e6365206f66207468652073656e646572206973206e6f7420656e6f7567682c746f207072696e7420746f6b656e202c6e6565643a34303936';
// 0x33b2e3c9fd0803ce7fffe00
// 0x33b2e3c9fd0803ce7fffe00
// 0x33b2e3c840f12d59937fe00
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


console.log(BigInt('0x0cee'))
