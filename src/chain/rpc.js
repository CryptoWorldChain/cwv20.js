import Method from './method.js'
import _ from 'lodash'
import utils from './utils';
import config from "./config.js"
import TransactionInfo from "./transaction.js"
import KeyPair from "./keypair";
import BN from 'bn.js';
import proto from './protos'

class PatternMethod extends Method {
	constructor(pattern, uri) {
		super(pattern)
		this.pattern = pattern;
		this.uri = uri;
	}
	static _(pattern, uri) {
		return new PatternMethod(pattern, uri)
	}
	static _(pattern, mod, cmd) {
		var uri = "/" + mod + "/pb" + cmd + ".do";
		return new PatternMethod(pattern, uri.toLowerCase());
	}
	request(args, opts) {
		var content;
		opts = opts || {};
		content = JSON.stringify(args);
		var baseUrl = opts.server_base || global.server_base || config.server_base;
		var rpcprovider = config.rpc_provider;
		if (rpcprovider) {
			return rpcprovider({
				baseUrl: baseUrl,
				uri: this.uri,
				method: 'POST',
				body: content
				//json:true
			})
		} else {
			return new Promise((resolve, reject) => {
				reject("rpc provider not found")
			});;
		}
	}

}

var getBlockByNumber = PatternMethod._(_.template('{"height":"<%- args[0] %>"}'), "bct", "gbn");
var getBalance = PatternMethod._(_.template('{"address":"<%- args[0] %>"}'), "act", "gac");
var getBlockByMax = PatternMethod._(_.template('{"address":"<%- args[0] %>"}'), "bct", "glb");
var getBlockByHash = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'), "bct", "gbh");
var getTransaction = PatternMethod._(_.template('{"hash":"<%- args[0] %>"}'), "tct", "gth");
var getStorageValue = PatternMethod._(_.template('{"address":"<%- args[0] %>","key":["<%- args[1] %>"]}'), "cvm", "gcs");
var sendRawTransaction = PatternMethod._(_.template('""'), "tct", "mtx");

var validOpts = function (opts) {
	var keypair = opts.keypair;
	var from = opts.from;
	if (!from) {
		return new Promise((resolve, reject) => {
			reject("brewchain.rpc:from not set or type error:" + from);
		});
	}
	if (!keypair) {
		return new Promise((resolve, reject) => {
			reject("key pair not set")
		});
	}
}

/** 
 * from = {"keypair":{"address":"","privateKey":""}, "nonce": 0}
 * 
 * type = 	NONE: 0,
 * 			PUBLICCRYPTOTOKEN: 1,
 *			OWNERTOKEN: 2,
 *			PUBLICCONTRACT: 4,
 *			CALLCONTRACT: 5,
 *          EVFSREQFILEUPLOAD: 9,
 *	        EVFSAUTHORISEFILEOP: 10,
 *	        EVFSCONFIRMFILEUPLOAD: 11
 *
 * create contract
 * args={"data":"", "amount":""}
 * 
 * call contract
 * args={"contract":"", "data":"", "amount":""}
 * 
 * public token
 * args={"token":"AAA", "amount":10000000000000000000000000000, "opCode":0} 
 * 
 * burn token
 * args={"token":"AAA", "amount":1000000000000000000000000, "opCode":1} 
 * 
 * mint token
 * args={"token":"AAA", "amount":1000000000000000000000000, "opCode":2} 
 * 
 * transfer balance
 * args=[{"address":"","amount":100},{"address":"", "amount":20}]
 * 
 * transfer token
 * args=[{"address":"","token":"AAA","tokenAmount":1000},{"address":"","token":"AAA","tokenAmount":2000}]
 * 
 * transfer crypto token
 * args=[{"address":"","symbol":"house","cryptoToken":["hash0","hash1"]},{"address":"","symbol":"house","cryptoToken":["hash2","hash3"]}]
 * 
 * evfs fileupload
 * args={}
*/
var __sign = function (from, type, args) {
	//发送交易
	if (!from) {
		return new Promise((resolve, reject) => {
			reject("brewchain.rpc:from not set or type error:" + from);
		});
	}
	var keypair = from.keypair;
	if (!keypair) {
		return new Promise((resolve, reject) => {
			reject("key pair not set")
		});
	}

	var opts = {};
	switch (type) {
		case transactionType.RC20_CONTRACT:
			console.log("RC20_CONTRACT");
			let ContractRC20 = proto.load("ContractRC20")
			let contractRC20 = ContractRC20.create();
			contractRC20.function=args.function;
			
			if(args.hasOwnProperty("name")){
				contractRC20.name=args.name;
			}
			if(args.hasOwnProperty("symbol")){
				contractRC20.symbol=args.symbol;
			}
			if(args.hasOwnProperty("decimals")){
				contractRC20.decimals=args.decimals;
			}

			if (args.tos) {
				let tos = [];
				for (let j = 0; j < args.tos.length; j++) {
					tos.push(Buffer.from(args.tos[j], "hex"));
				}
				contractRC20.tos = tos;
			}
			if (args.values) {
				let values = [];
				for (let j = 0; j < args.values.length; j++) {
					values.push(new BN(args.values[j]).toArrayLike(Buffer));
				}
				contractRC20.values = values;
			}
			console.log("ContractRC20=="+JSON.stringify(contractRC20));
			let codedata=ContractRC20.encode(contractRC20).finish();
			opts = getTransactionOpts(from, type, args.ext_datas, codedata);
			break;
		case transactionType.RC721_CONTRACT:
			console.log("RC721_CONTRACT");
			break;
		case transactionType.CVM_CONTRACT:
			if (!args || !args.data) {
				// reject("缺少参数data");
				console.error("缺少参数data");
			} else {
				// let CVMContract = proto.load("CVMContract");
				// let cvmContract = CVMContract.create();
				// cvmContract.parrallel = (args.parrallel == null ? false : args.parrallel);
				// cvmContract.datas=args.data;
				// let codedata=CVMContract.encode(cvmContract).finish();
				
				let codedata = Buffer.from(args.data, "hex")
				if (args.contract) {
					let outs = [];
					let out = {
						address: Buffer.from(removePrefix(args.contract), "hex"),
						amount: new BN(0).toArrayLike(Buffer)
					};
					outs.push(out);
					let codedata = Buffer.from(args.data, "hex")
					opts = getTransactionOpts(from, type, null, codedata, outs);
				} else {
					opts = getTransactionOpts(from, type, null, codedata);
				}
			}
			break;
		default:
			let outs = generateOutputs(args);
			opts = getTransactionOpts(from, type, null, null, outs);
			break;
	}
	return new TransactionInfo(opts).genBody();
}
var __sendTxTransaction = function (from, type, args) {
	let result = __sign(from, type, args);
	return sendRawTransaction.request(result);
};

var generateOutputs = function (outputs) {
	let outs = [];
	let pams = outputs;

	for (let i = 0; i < pams.length; i++) {
		let pm = pams[i];
		let out = {
			address: Buffer.from(removePrefix(pm.address), "hex"),
			amount: new BN(0).toArrayLike(Buffer),
		};
		if (pm.amount) {
			out.amount = new BN(pm.amount).toArrayLike(Buffer);
		}
		if (pm.token && pm.tokenAmount) {
			out.token = Buffer.from(pm.token, "ascii");
			out.tokenAmount = new BN(pm.tokenAmount).toArrayLike(Buffer);
		}
		if (pm.cryptoToken && pm.symbol) {
			let cryTokens = [];
			for (let j = 0; j < pm.cryptoToken.length; j++) {
				cryTokens.push(Buffer.from(pm.cryptoToken[j], "hex"));
			}
			out.symbol = Buffer.from(pm.symbol, "ascii");
			out.cryptoToken = cryTokens;
		}
		outs.push(out);
	}
	return outs;
}

var getTransactionOpts = function (from, type, extdata, codedata, outputs) {
	var opts = {};
	opts.keypair = from.keypair;
	let nonce = from.keypair.nonce;
	opts.nonce = (nonce === 0 || isNaN(nonce)) ? null : nonce;
	opts.inner_codetype = type;
	opts.ext_data = extdata || null;
	opts.code_data = codedata || null;
	opts.outputs = outputs || null;

	return opts;
}
//transfer类型
var transactionType = {
	NORMAL: 0,//普通交易
	MULI_SIGN: 1,//多重签名交易
	RC20_CONTRACT: 2,//RC20交易
	RC721_CONTRACT: 3,//RC721交易
	CVM_CONTRACT: 4,//CVM合约调用
};
//crc20类型
var functionType = {
	CONSTRUCT_FIXSUPPLY: 1,
	CONSTRUCT_PRINTABLE: 2,
	TRANSFERS: 3,
	PRINT: 4,
	BURN: 5,
	ADDMANAGERS: 6,
	RMMANAGERS: 7
}

var removePrefix = function (addr) {
	if (addr.startsWith('0x')) {
		return addr.substring(2);
	} else {
		return addr;
	}
}
export default {
	/**
	 * 获取balance
	 * @param {*} args 0x59514f8d87c964520fcaf515d300e3f704bf6fcb
	 * @param {*} opts 
	 */
	getBalance: function (args, opts) {
		return getBalance.request({ "address": removePrefix(args) }, opts);
	},
	/**
	 * 按高度获取区块信息
	 * @param {*} args 
	 * @param {*} opts 
	 */
	getBlockByNumber: function (args, opts) {
		return getBlockByNumber.request({ "height": removePrefix(args), "type": 1 }, opts);
	},
	getBlockByHash: function (args, opts) { return getBlockByHash.request({ "hash": removePrefix(args) }, opts); },
	getBlockByMax: function (args, opts) { return getBlockByMax.request(args, opts); },
	/**
	 * 查交易
	 * @param {*} args "0xaabc6be80cb8f2f2c3657532833bde26692986c38421ab4a2141f882cee2b0f1"
	 * @param {*} opts 
	 */
	getTransaction: function (args, opts) {
		return getTransaction.request({ "hash": removePrefix(args) }, opts);
	},
	/**
	 * 
	 * @param {*} args 0x59514f8d87c964520fcaf515d300e3f704bf6fcb
	 * @param {*} opts ["","",""]
	 */
	getStorageValue: function (args, opts) {
		return getStorageValue.request({ "address": removePrefix(args), "key": [opts] });
	},
	/**
	 * 获取交易类型
	 */
	getTransType: function () {
		return transactionType;
	},
	/**
	 * transfer normal
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} args [{"address":"066c03fcc3048863f72b051530e5a212fb9233f6","amount":""}]
	 */
	transfer: function (from, args) {
		return __sendTxTransaction(from, transactionType.NORMAL, args);
	},
	/**
	 * create contract
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} args {"data":"hexstring"}
	 */
	createContract: function (from, exdata, args) {
		return __sendTxTransaction(from, transactionType.CVM_CONTRACT, args);
	},
	/**
	 * call contract
	 * @param {*} from 
	 * @param {*} args {"contract":"", "data":"hexstring", "amount":""}
	 */
	callContract: function (from, exdata, args) {
		return __sendTxTransaction(from, transactionType.CVM_CONTRACT, args);
	},
	/**
	 * 发布token
	 * @param {*} from {"keypair":{"address":"","privateKey":"",nonce:10}}
	 * @param {*} args {"tos":["",""], "values":["",""],"name":"","symbol":"","decimals":12,"ext_datas":"hexstring"} 
	 */
	createToken:function(from,args){
		args.function=functionType.CONSTRUCT_PRINTABLE;
		return __sendTxTransaction(from, transactionType.RC20_CONTRACT, args);
	},
	/**
	 * sign
	 * @param {*} from 
	 * @param {*} args 
	 */
	sign:function(from,type, args){
		// return __sendTxTransaction(from, transactionType.NORMAL, null, args);
		return __sign(from, type, args);
	},
	/**
	 * 交易hash签名
	 * @param {*} from {"keypair":{"address":"","privateKey":""}}
	 * @param {*} exdata 
	 * @param {*} args {data:"交易hash"} 
	 */
	signTx: function (from, exdata, args) {
		var d = new Date().getTime();
		var buf = new BN(d).toArrayLike(Buffer, d, 32);
		console.log(buf.toString('hex'))

		return {
			sign: from.keypair.ecHexSign(args.data + buf.toString('hex')),
			timestamp: d,
			tx: args.data
		};
	}
}