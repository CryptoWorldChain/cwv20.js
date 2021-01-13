const chain=require('./dist/brewchain.js');
const fs=require('fs');
var rp = require('request-promise');
// var EthereumBip44 = require('ethereum-bip44-native');

var BN=require('bn.js');
var web3 = require('web3');
//set testnet network type
chain.config.server_base ='http://localhost:8000/fbs';
// chain.config.server_base ='http://jf:58333/fbs';
chain.config.rpc_provider = rp;
hex='0x908786920385aa00000';
hex='0x4501d6f3d0125e8000';
// hex="0x10000000000000000000";
0x36b9e11e3e4bbf8000
0x36bac25c351a820000
0x36bac25c351a820000
//0x1faa5eb88494e8bb48000000
var num=hex;
        if (hex.startsWith('0x')) {
            num=hex.substring(2);
        }
        var a=new BN(num,16);
        console.log(a.toString(10));
        
// df008191d57d7f7c20a00c6d8bcdce9d68c847e5
// 3c1ea4aa4974d92e0eabd5d024772af3762720a0  79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51
// 533a5a084cd587c86c20a0ddfb28f9ad018f341a  84a8d84288b9db81083004b0cf70ac02e696760207d689d9a4e1a773ebf80264
// c60042d114c2a1ba13e154f446badf8e152a923f  3f1caff94cc871ae796c61ddbf360e0bd515eb26047215634e7386e4a1ea0ab8
// ee155386bf40a7d55f0bef92743adc0c8fb0683c  565ab31d16d4b8bc408ab5ce84ef265f58f337c20386f3dfdc7eb6fe9aad5280
// 97f1bd5e9cae1d7f52bbb2818d80c8ca9392215b  ac289f69fad7a5a86b90e1518877d9919d1ee2ff84a4210d5e081823e7ceb9ba
// 07d2697074d522a2903be3e3cd4478f183040c5d bc791c2f29df8b4fc1716fcb8438227b41c23104a74c74b1221fbd1aa151c3cc
// 测试链默认有钱的 3c1ea4aa4974d92e0eabd5d024772af3762720a0  79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51

// var kp = chain.KeyPair.genCVNFromPrikey('ee353e42dab6de236e0071257bddeb1402dbf56de5d003ef2c08fc976f016380')
// var kp = chain.KeyPair.genCVNFromPrikey('0375ea2f22fba13b203babdcc3f6cbfeeee25e5f38c86c668d568c04052dcf9b')
// var kp= chain.KeyPair.genCVNFromPrikey("bc791c2f29df8b4fc1716fcb8438227b41c23104a74c74b1221fbd1aa151c3cc")
// var kp=chain.KeyPair.genCVNRandomKey();
var kp = chain.KeyPair.genCVNFromPrikey("79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51")

// var kp=chain.KeyPair.genRandomKey()
kp.hexAddress=chain.rpc.removeCVN(kp.hexAddress);
var from={
    keypair:kp
}


// kp.pubkey="";
// var store=chain.keystore.exportJSON(kp,'000000')
// console.log(store)
// console.log(kp)
// console.log(chain.keystore.json2KeyPair(store,'000000'))
chain.rpc.getBalance(from.keypair.hexAddress).then(function(result){
    // ************************1.transfer************************
    result=JSON.parse(result);
    from.keypair.nonce=result.nonce;
    var args=[
        {"address":chain.rpc.removeCVN("533a5a084cd587c86c20a0ddfb28f9ad018f341a"),
        "amount":"1000000000000000000000"}
    ]
    // chain.rpc.transfer(from,null,args).then(function(result){
    //     console.log(result)
    // })
    console.log(JSON.stringify(chain.rpc.signDecode(chain.rpc.signTransfer(from,null,args))))

    /*{"body":
        {"nonce":381,"address":"PB6kqkl02S4Oq9XQJHcq83YnIKA=",
        "outputs":[{"address":"UzpaCEzVh8hsIKDd+yj5rQGPNBo=","amount":"NjXJrcXeoAAA"}],
        "timestamp":"1610515272314"},
        "signature":"vi8aw9svprrrUBNJDjydUjBwCmaZ0+dELcDc82tmtccsroJRrtqWaqJRaQymW9mFIb4h5OKXDPPDAXOdK8XLPTwepKpJdNkuDqvV0CR3KvN2JyCgooKeX/zKeJGWhtzdcglk21Y4UtgKK79XVQQH7y00NzDaDbS+OHvBXbqoPgbEugKjmifMQS3HoijJ7BNrHgPDVA=="
    }*/
    
    let data=chain.rpc.signDecode(chain.rpc.signTransfer(from,null,args))
    console.log(Buffer.from(data.body.address,"hex").toString("hex"))
    console.log(new BN(data.body.outputs[0].amount).toString(10))
    // console.log(from)
    // ************************2.createContract************************
    // var cvm = "608060405234801561001057600080fd5b5060df8061001f6000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636057361d14604e578063b05784b8146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600080549050905600a165627a7a72305820932e47aec0222dc95d62713ff319c47ef736ebffa72eadb17185eadfd6adaa180029";
    // args={"data":cvm};
    // chain.rpc.createContract(from,null,args).then(function(result){
    //     console.log("cvm:"+result)
    // }).catch(function(error){
    //     console.log("error==="+error);
    // })

    // args={"contract":"0x1c81566438e4f089f893557379ba9332450beb3d","data":"6057361d0000000000000000000000000000000000000000000000000000000000002710"}
    // chain.rpc.callContract(from,null,args).then(function(result){
    //     console.log(result)
    // }).catch(function(error){
    //     console.log(error);
    // })
    // ************************2.createToken************************
    // from.keypair.nonce=result.nonce;
    // args={"tos":["5d9cdda85093d68c28573ae9875eb32dbad6f0e0",'3d4fb132d1dc29ec97ec3196b42f2ff6570d071d'], 
    // "values":["10000000000000000000000000","10000000000000000000000000"],"name":"GC","symbol":"GC","decimals":18,
    // "ext_datas":Buffer.from(JSON.stringify({"c":"2"}),"utf8").toString("hex")} 
    // chain.rpc.createToken(from,null,args).then(function(result){
    //     console.log(result);
    // }).catch(function(error){
    //     console.log("error==="+error);
    // })
    // token="0xe41f28527d533a20534717300e7c2d6201c41c89";
    // token="0x7accab72bab4d2738c0f031a259f8c6bc93119fb";
    // args={"tos":["7dfb8479d6d47d3ac3c9565a483bcb976afda456"], "values":["10000000000000000000000"]} 
    // chain.rpc.transferToken(from,token,args).then(function(result){
    //     console.log(result)
    // }).catch(function(error){
    //     console.log(error);
    // })
    // var args = { 
    //     "tokenAddrOrSymbol":"EVS","nodeSize":10000,"nodeName":"testd",
    //     "extDesc":"tests","replicas":0,"slices":1,
    //     "tos":["533a5a084cd587c86c20a0ddfb28f9ad018f341a"],"values":["0x0"],
    //     "licenseFee":"10","licensePrice":"100"
    // }
    // var req=chain.rpc.signReqUpload(from,args);
    // console.log("req="+JSON.stringify(req));
    // var options = {
    //     method: 'POST',
    //     uri: chain.config.server_base+'/poc/pbreq.do',
    //     body: JSON.stringify(req),
    // };
    // rp(options).then(function (item) { 
    //     console.log("RespEVNode="+item)   
    // })
    // .catch(function (err) {
    //     // POST failed...
    //     console.log("错误",err)
    // });

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


var hex='0x45766e6f646520616c726561647920617574686f72697a6564';

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
// hex = "0x108e0db5c0c5cff9d4a33af27cb27e0a2459c08";
// function hexToString(hex,precision){
//     if (hex.indexOf("0x")>-1){
//         return ((BigInt(hex))/BigInt(10 **(18-precision))).toString()
//     }else{
//         return (BigInt("0x".concat(hex))/BigInt(10 **(18-precision))).toString()
//     }
// }
// console.log(hexToString(hex,2).toString())


