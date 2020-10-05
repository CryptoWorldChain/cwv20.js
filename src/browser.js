//ios对接使用
import lib 	from  './index'
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
        args={
            "tos":["a5c31be225011ee6ecceaf3b9b3696db01a20d6c",'97f1bd5e9cae1d7f52bbb2818d80c8ca9392215b'], 
            "values":["100000000000000000000","200000000000000000000"],
            "name":"CCC","symbol":"CCC","decimals":18,
            "ext_datas":Buffer.from(JSON.stringify({"c":"2"}),"utf8").toString("hex")
        }
    
        let result = lib.rpc.signCreateToken(from,exdata,args);
    
        return result.tx;
    },
    signTransferToken:function(nonce,prikey,args){
        // token="0x77fcd28a595cc528e9f8293e79a01c2dee7e20ab";
        // args={"tos":["3c1ea4aa4974d92e0eabd5d024772af3762720a0"], "values":["1000000000000000000"]} 
        let from = getPrikey(nonce,prikey);
        let result = lib.rpc.signCreateToken(from,exdata,args);
        return result.tx;
    },
    signTransfer:function(nonce,prikey,exdata,args){
        // var args=[{"address":"46f1f188bca9c555464ab41daecffaa0405f177c","amount":"10000000000000000000000"}]

        let from = getPrikey(nonce,prikey);
        let result = lib.rpc.signCreateToken(from,exdata,args);
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
        if (hex.indexOf("0x")>-1){
            return ((BigInt(hex))/BigInt(10 **(18-precision))).toString()
        }else{
            return (BigInt("0x".concat(hex))/BigInt(10 **(18-precision))).toString()
        }
    },
    KeyPair:lib.KeyPair,
    Buffer:lib.Buffer,
}