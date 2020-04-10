
import utils from '../utils';

import Method from '../method';

import proto from '../protos'


export default class GetBalance extends Method {

	constructor(args) {
		// code
		super(args);
		this.uri = "/act/pbgac.do"
	}
	// methods
	toJSONPayload(args){
		return {"address":this.args[0]};
	}
	

}
