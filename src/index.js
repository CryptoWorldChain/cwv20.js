
import Buffer from 'buffer'
import KeyPair  from "./chain/keypair.js"
import Protos	from "./chain/protos.js"
import keystore	from "./chain/keystore.js"
import config	from "./chain/config.js"
import utils	from "./chain/utils.js"
import rpc 	from  './chain/rpc'

const VERSION = "v1.0.0";

export default {
	version:VERSION,
   	KeyPair:KeyPair,
   	protos:Protos,
   	keystore:keystore,
   	utils:utils,
   	config:config,
   	Buffer:Buffer,
   	rpc:rpc
};
