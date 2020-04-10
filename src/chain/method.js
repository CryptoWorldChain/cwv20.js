
import utils from './utils';

export default class Method {

	constructor(args) {
		if(args.constructor.name=="Array"){
			this.opts = args;
		}else if(args.constructor.name=="String"){
			this.opts = [args];
		}else{
			this.opts = args;
		}
	}

	toJSONPayload(){

	}

	formatOutput(err,response,body){
		if(!err){
			return body;
		}else{
			return {"ret":-1,"error":""+err,"respCode":response.statusCode}
		}
	}

	removePrefix(addr){
		if(addr.startsWith('0x')){
			return addr.substring(2);
		}else{
			return addr;
		}
	}

}