import lib 	from  './index'
import rp from 'request-promise'

lib.config.rpc_provider = rp;

export default {
	hexToBigIntString:function(hex,precision){
        if (hex.indexOf("0x")>-1){
            return ((BigInt(hex))/BigInt(10 **(18-precision))).toString()
        }else{
            return (BigInt("0x".concat(hex))/BigInt(10 **(18-precision))).toString()
        }
    },
    version:lib.VERSION,
   	KeyPair:lib.KeyPair,
   	protos:lib.Protos,
   	keystore:lib.keystore,
   	utils:lib.utils,
   	config:lib.config,
   	Buffer:lib.Buffer,
	rpc:lib.rpc 
}