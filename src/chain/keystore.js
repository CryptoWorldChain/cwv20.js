import proto from './protos'
import config from './config'
import utils from './utils'
import aesjs from 'aes-js';
import MD5 from 'md5.js';
import sha3 from 'sha3';
import KeyPair from "./keypair";

const testnet_keystore1 = require('!Keystore/testnet/keystore1.json')
var pbkdfmd5 = function(password,salt,bytesNeeded){
	
    var buf=[];// byte[]  buf = new byte[digest.getDigestSize()];
    var  key="";//= new byte[bytesNeeded];
    var digest = new MD5();
    
    for (;;){
        digest.update(password);
        digest.update(salt);

        var buf = digest.digest();
        
        var len = (bytesNeeded > buf.length) ? buf.length : bytesNeeded;
        key=key+new Buffer(buf.slice(0,len)).toString('hex');
        //System.arraycopy(buf, 0, key, offset, len);
        bytesNeeded -= len;
        if (bytesNeeded == 0)
        {
            break;
        }
        // do another round
        digest = new MD5();
        digest.update(buf);
    }
    
    return key;
}

var self={
	pbkdfmd5:pbkdfmd5,
	parse:function(ksJSON,passwd){
		if(ksJSON.ksType=='aes'){
			var encryptedBytes=utils.hexToArray(ksJSON.cipherText);
			var iv=utils.hexToArray(ksJSON.cipherParams.iv);
			var salt=Buffer.from(ksJSON.params.salt,'hex')

			var hash=sha3(256);
			hash.update(Buffer.from(passwd));

			var hashpasswd=utils.toHex(hash.digest());

			// console.log("hashpasswd=="+hashpasswd);

			var pkcs5_passwd=utils.toHex(hashpasswd.split('').map(x=>x.charCodeAt(0)))
			var derivedKey = pbkdfmd5(Buffer.from(pkcs5_passwd,'hex'), salt, 32);
			var aesCbc = new aesjs.ModeOfOperation.cbc(Buffer.from(derivedKey,'hex'),iv);
			var result=aesCbc.decrypt(encryptedBytes).slice(0,ksJSON.params.l);
			// console.log("get result:"+utils.toHex(result));
			return result;
		}else{
			throw new TypeError("unsuport encrypt type:ksType="+ksJSON.ksType);
		}
	},
	paddingData:function(data){
		
		var padlen = data.length/16*16;
		if(data.length%16==0){
			return data;
		}else{
			var sizematch = (Math.floor(data.length/16)+1)*16;
			var padsize = sizematch - data.length
			var result = new Array(sizematch);
			var paddata = Buffer.from(utils.randomArray(padsize,padsize));
			data.copy(result,0,0,data.length);
			paddata.copy(result,data.length,0,padsize);
			return result;		
		}

	},
	exportJSON:function(kp,passwd){
		const KeyStoreValue = proto.load('KeyStoreValue')

		var  ks = KeyStoreValue.create(
			{address:kp.hexAddress,prikey:kp.hexPrikey,pubkey:kp.hexPubkey,
				nonce:kp.nonce
			});
 		let  data = Buffer.from(KeyStoreValue.encode(ks).finish());

		var salt=Buffer.from(utils.randomArray(8));

		var hash=sha3(256);
		passwd = passwd || kp.keystore_pwd
		hash.update(Buffer.from(passwd));

		var hashpasswd=utils.toHex(hash.digest());

		// console.log("hashpasswd=="+hashpasswd);

		var pkcs5_passwd=utils.toHex(hashpasswd.split('').map(x=>x.charCodeAt(0)));

		var derivedKey = pbkdfmd5(Buffer.from(pkcs5_passwd,'hex'), salt, 48);
		// console.log("derivedKey="+derivedKey);
		var iv=Buffer.from(derivedKey.slice(64,96),'hex');	
		// console.log("derivedKey="+derivedKey.slice(0,64)+",iv="+derivedKey.slice(64,96));
		var aesCbc = new aesjs.ModeOfOperation.cbc(Buffer.from(derivedKey.slice(0,64),'hex'),iv);


		var encryptData=aesCbc.encrypt(self.paddingData(data));

		var jsResult = 
			{
			  "ksType": "aes",
			  "params": {
			    "dklen": 256, 
			    "c": 128,
			    "l": data.length,
			    "salt": utils.toHex(salt)
			  },
			  "pwd": hashpasswd,
			  "cipher": "cbc",
			  "cipherParams": {
			    "iv": utils.toHex(iv)
			  },
			  "cipherText": utils.toHex(encryptData)
			}
		;
		// console.log("enc result:"+JSON.stringify(jsResult));
		return jsResult;
	},
	json2KeyPair:function(jsonTxt,password){
		const KeyStoreValue = proto.load('KeyStoreValue')

		var decryptret = self.parse(jsonTxt,password);
		var ks = KeyStoreValue.decode(decryptret);

		if(ks){
			// console.log("address=="+ks.address);
			var kps= KeyPair.genFromPrikey(ks.prikey);
			if(ks.nonce>0){
				kps.setNonce(ks.nonce);
			}
			kps.setKeyStorePwd(password);
			return kps;
		}else{
			console.log("ks not found");
			return NaN;
		}
	}

}

export default self;