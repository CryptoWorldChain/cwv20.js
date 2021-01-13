
import { load,parse } from "protobufjs"; // respectively "./node_modules/protobufjs"

var __pbfiles = require.context("./proto/", true, /\.proto$/);

var Types = []

function nestedLoad(ns,parentns){
	var registerTypes = []
	for(var chname in ns.nested){
		var childns = ns.nested[chname];
		// console.log("check child:"+childns+",@"+ns+",type="+typeof(childns));
		 if(childns.nestedArray&&childns.nestedArray.length>0){
			registerTypes = registerTypes.concat(nestedLoad(childns,parentns+"."+childns.name));
		} else if(typeof(childns)=='object')
		{
			var typename = (parentns+"."+childns.name).slice(1)
			// console.log("regist netsted obj:"+typeof(childns)+",name="+typename);	
			registerTypes.push(childns.name)
		}else{
			// console.log("omit:"+chname+","+childns)
		}
	}
	return registerTypes;
}


class PBLoader {

	initLoad(){
		this.rootByType = new Map();
		var _rbt = this.rootByType;
		__pbfiles.keys().forEach(function (key) {
		 	// console.log(`get pbfile:`+key+",=="+__pbfiles(key))

		 	try{
		 		var source = __pbfiles(key);
		 		var ret=parse(source);
		 	// load(__pbfiles(key), function(err, root) {
				if(ret&&ret.root){
					var root=ret.root;
					// console.log(`load == ${JSON.stringify(root)}`);
					var ret=nestedLoad(root,"");
					// console.log("llo==."+ret)
					// Types=Types.concat(ret);
					for(var id in ret){
						_rbt.set(ret[id],root);
						Types.push(ret[id]);
					}
				}
			// }
		 }catch(err){
		 		console.log("get error:"+err);
			}

		 });
	}

	loadType(name){
		var rt=this.rootByType.get(name);
		if(rt){
			return rt.lookupType(name);
		}else{
			return NaN;
		}
	}

}



var pbloader = new PBLoader();

pbloader.initLoad();

var __loadType = function(name){
	return pbloader.loadType(name);
}

// var pp=pbfiles("./oentity.proto");
// console.log("getpp="+pp)
// var KeyStoreValue


// load(pp, function(err, root) {
// 	Messages.oroot = root;
// 	console.log(`load == ${root} ,err=${err}`);
// 	const 	PACKAGE = 'org.brewchain.';
//   	KeyStoreValue = root.lookupType(PACKAGE+"bcapi.gens.KeyStoreValue");
//   	var  	ks=KeyStoreValue.create({address:"0002232",prikey:'aaabb',pubkey:'test'});
//   	console.log(`ks = ${JSON.stringify(ks)}`);
//   	let buffer = KeyStoreValue.encode(ks).finish();
//   	console.log(`buffer = ${Array.prototype.toString.call(buffer)}`);
// })


export default {
	Types:Types,
	pbloader:pbloader,
	load:__loadType,
	parse:parse,
	pbfiles:__pbfiles
}