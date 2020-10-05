"use strict";

import proto from './protos'
import config	from "./config.js"
import utils from './utils'
import Method from './method'
import BN from 'bn.js';

 class Transaction extends Method {
	/**
	 * 
	 * @param {*} this.args 
	 * this.args:{
	 * 	from:"",to:"",amount:"",
	 * }
	 */
	constructor(args) {
		// code
		super(args);
		this.args = args;
		this.uri = "/txt/pbmtx.do"
	}
	genBody(){	//override by implements
		return {};
	}
    //
	// methods
	toJSONPayload(args){
		return {"address":args[0]};
	}
}

export default class TransactionInfo extends Transaction {
	constructor(args) {
		super(args);
	}
	genBody(){
		let TransactionBody = proto.load('TransactionBody');
		var txbody = NaN;
		let keypair = this.args.keypair;
		// let timestamp = new Date().getTime();
        txbody = TransactionBody.create();

		if (this.args.nonce) {
			txbody.nonce = this.args.nonce;
		}
        txbody.address = Buffer.from(this.removePrefix(keypair.hexAddress),'hex');
        
        if(this.args.ext_data !== null) {
            txbody.extData = Buffer.from(this.args.ext_data, 'hex');
        }

        if(this.args.code_data !== null){
			txbody.codeData = Buffer.from(this.args.code_data, 'hex');
		}

        if (this.args.outputs !== null){
            for(let i=0;i<this.args.outputs.length;i++) { 
                txbody.outputs.push(proto.load("TransactionOutput").create(this.args.outputs[i]))
            }
        }
		txbody.timestamp = new Date().getTime();
		txbody.innerCodetype = this.args.inner_codetype!=0?this.args.inner_codetype:null;

		let ecdata = Buffer.from(TransactionBody.encode(txbody).finish());
        let ecdataSign = keypair.ecHexSign(ecdata);

		let transactionInfo = proto.load("TransactionInfo");
        let tinfo = transactionInfo.create({
			body:txbody,
			signature:Buffer.from(ecdataSign,"hex")
		});
		
		// console.log("tinfo==="+ JSON.stringify(tinfo));
		let tx = Buffer.from(transactionInfo.encode(tinfo).finish(),"hex").toString("hex");
		
        return {"tx":tx};
	}
}