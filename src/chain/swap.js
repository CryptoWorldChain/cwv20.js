
import abi from 'ethereumjs-abi'
import { Keccak } from 'sha3';

var KeyEnum={
    const_K:11,
    fee_ratio:10,
    liquidBalances:6,managers:2,mancount:1,changeReqs:3,
    poolBalance0:7,
    poolBalance1:8,
    poolLiquidity:9,requestCount:0,status:12,
    token0:4,token1:5
}
var keyHexString=function(value){
    return value.padStart(64,'0')
}

export default{
    /**
     * get contract code
     * @param {*} bytecode
     * @param {*} token0
     * @param {*} token1 
     * @param {*} mans 
     */
    byteCode:function(bytecode,token0,token1,mans){
        let encoded=abi.simpleEncode(
            "constructor(address,address,address[])",
            "0x".concat(Buffer.from(token0).toString("hex").concat('20').padStart(40,'0')),
            "0x".concat(Buffer.from(token1).toString("hex").concat('20').padStart(40,'0')),
            mans
        );
        return bytecode.concat(Buffer.from(encoded).toString("hex"));
    },
    /**
     * init contract token amount
     * @param {*} value0 token0 amount 
     * @param {*} value1 token1 amount
     */
    initPool:function(value0,value1){
        let encoded=abi.simpleEncode("initPool(uint256,uint256)",value0,value1);
        return Buffer.from(encoded).toString("hex");
    },
    /**
     * swap token0 vs token1
     * @param {*} value0 token0 amount
     * @param {*} value1 token1 amount 
     */
    swap:function(value0,value1){
        let encoded=abi.simpleEncode("swap(uint256,uint256)",value0,value1);
        return Buffer.from(encoded).toString("hex");
    },
    /**
     * addLiquid
     * @param {*}} value0 token0 amount
     * @param {*} value1 token1 amount
     */
    addLiquid:function(value0,value1){
        let encoded=abi.simpleEncode("addLiquid(uint256,uint256)",value0,value1);
        return Buffer.from(encoded).toString("hex");
    },
    /**
     * 用户取出流动性
     * @param {*} value 
     */
    removeLiquid:function(value){
        let encoded=abi.simpleEncode("removeLiquid(uint256)",value);
        return Buffer.from(encoded).toString("hex");
    },
    /**
     * 转让流动性代币
     * @param {*} to 
     * @param {*} value 
     */
    transferLiquid:function(to,value){
        let encoded=abi.simpleEncode("transferLiquid(address,uint256)",to,value);
        return Buffer.from(encoded).toString("hex");
    },
    /**
     * 常量
     */
    const_K:function(){
        return keyHexString(KeyEnum.const_K.toString(16));
    },
    /**
     * 手续费
     */
    fee_ratio:function(){        
        return keyHexString(KeyEnum.fee_ratio.toString(16));
    },
    /**
     * token0流动池余额大小
     */
    poolBalance0:function(){
        return keyHexString(KeyEnum.poolBalance0.toString(16));
    },
    /**
     * token1流动池余额大小
     */
    poolBalance1:function(){
        return keyHexString(KeyEnum.poolBalance1.toString(16));
    },
    /**
     * 总流动性
     */
    poolLiquidity:function(){
        return keyHexString(KeyEnum.poolLiquidity.toString(16));
    },
    /**
     * 查询每个地址的流动代币
     * @param {*} address 
     */
    liquidBalances:function(address){
        let code=keyHexString(address).concat(keyHexString(KeyEnum.liquidBalances.toString(16)));
        const hash = new Keccak(256);
        hash.update(new Buffer(code, 'hex'));
        return Buffer.from(hash.digest()).toString('hex');
    }
}