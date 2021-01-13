import lib 	from  './index'
import BN from 'bn.js';
/**
 * 
 * @param {*} nonce 
 * @param {*} prikey 
 */

function getPrikey(nonce,prikey){
    let kp=lib.KeyPair.genFromPrikey(prikey);
    let from={
        keypair:kp
    }
    from.keypair.nonce=nonce;
    return from;
}
export default {
    signCreateContract:function(nonce,prikey,exdata,bytecode){
        let from = getPrikey(nonce,prikey);
        let args={"data":bytecode}
        
        let result = lib.rpc.signCreateContract(from,exdata,args);
    
        return result.tx;
    },
    signCallContract:function(nonce,prikey,exdata,bytecode,contractaddress){
        let from = getPrikey(nonce,prikey);
        let args={"contract":contractaddress,"data":bytecode}
        let result = lib.rpc.signCallContract(from,exdata,args);
    
        return result.tx;
    },
    signCreateToken:function(nonce,prikey,exdata,args){
        let from = getPrikey(nonce,prikey);
        // args={
        //     "tos":["a5c31be225011ee6ecceaf3b9b3696db01a20d6c",'97f1bd5e9cae1d7f52bbb2818d80c8ca9392215b'], 
        //     "values":["100000000000000000000","200000000000000000000"],
        //     "name":"CCC","symbol":"CCC","decimals":18,
        //     "ext_datas":Buffer.from(JSON.stringify({"c":"2"}),"utf8").toString("hex")
        // }
    
        let result = lib.rpc.signCreateToken(from,exdata,args);
    
        return result.tx;
    },
    signTransferToken:function(nonce,prikey,token,args){
        // token="0x77fcd28a595cc528e9f8293e79a01c2dee7e20ab";
        // args={"tos":["3c1ea4aa4974d92e0eabd5d024772af3762720a0"], "values":["1000000000000000000"]} 
        let from = getPrikey(nonce,prikey);
        let result = lib.rpc.signTransferToken(from,token,args);
        return result.tx;
    },
    signTransfer:function(nonce,prikey,exdata,args){
        // var args=[{"address":"46f1f188bca9c555464ab41daecffaa0405f177c","amount":"10000000000000000000000"}]

        let from = getPrikey(nonce,prikey);
        let result = lib.rpc.signTransfer(from,exdata,args);
        return result.tx;
    },
    genFromPrikey:function(prikey){
        let kp=lib.KeyPair.genFromPrikey(prikey);
        return JSON.stringify({"hexPrikey": kp.hexPrikey,"hexPubkey":kp.hexPubkey,"hexAddress":kp.hexAddress});
    },
    genRandomKey:function(){
        var kp = lib.KeyPair.genRandomKey();
        return JSON.stringify({"hexPrikey": kp.hexPrikey,"hexPubkey":kp.hexPubkey,"hexAddress":kp.hexAddress});
    },
    hexToBigIntString:function(hex,precision){
        var num=hex;
        if (hex.startsWith('0x')) {
            num=hex.substring(2);
        }
        var a=new BN(num,16);
        a=a.div(new BN("1".padEnd(19-precision,0)));
        return (a.toString(10));
    },
    KeyPair:lib.KeyPair,   	
    keystore:lib.keystore,
    rpc:lib.rpc,
	version:lib.VERSION,
    protos:lib.Protos,
    utils:lib.utils,
    config:lib.config,
    Buffer:lib.Buffer,
}