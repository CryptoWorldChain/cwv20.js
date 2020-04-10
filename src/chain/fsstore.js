/**
	负责数据的存储
	@TODO: chrome plugin support
*/
import 	_ from 'lodash'
import utils from './utils';
import config	from "./config.js"
import fs from 'fs';
import path from 'path';

class FSStore  {
	constructor(args) {
		// code
	}

	// methods

	static readAccounts(){
		fs.readdirSync(config.store_path).filter(function(file) {
		    // Only keep the .js files
		    // return file.substr(-3) === '.js';
		    return true;

		}).forEach(function(file) {
			console.log("get file");
		});


	}

}

export default{
	FSStore: FSStore
}