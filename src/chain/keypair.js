import {Buffer} from 'buffer';
import ecc from '../ecc/ecc'
// import * as CryptoJS from 'crypto-js';
// import elliptic from 'elliptic';
import HmacDRBG from 'hmac-drbg';

import sha2 from 'sha2'

// window.ecc=ecc;
// window.sha2=sha2;
import utils from './utils';

function reverts(strhex){
	if(strhex.length%2 != 0){
		strhex = '0'+strhex
	}
	var arr=new Uint8Array(new Buffer(strhex,'hex')).reverse()
	return utils.toHex(arr);
}

export default class KeyPair { 
	constructor(pri,pub,addr,eckey,nonce){
		this.hexPrikey = pri;
		this.hexPubkey = pub;
		this.hexAddress = addr;
		this._ecKey = eckey;
		this.nonce = nonce||0;
		this.keystore_pwd = NaN;
		this.keystore_filename = NaN;
	}
	setKeyStorePwd(pwd){
		this.keystore_pwd = pwd;
	}
	setKeyStoreFileName(filename){
		this.keystore_filename = filename;
	}
	static genFromPrikey(hexPrikey){
		// var key = new ecc.ECKey(ecc.ECCurves.secp256r1, new Buffer(hexPrikey,'hex'));
		// console.log("genFromPrikey")
		var reverseHexKey=reverts(hexPrikey);
		// console.log("reverseHexKey="+reverseHexKey); 
		var key = new ecc.ec('secp256r1').keyFromPrivate(reverseHexKey);
		return KeyPair.genFromECCKey(key);
	}

	static genFromPubkey(hexPubkey){ 
		var x = Buffer.from(new Uint8Array(new Buffer(hexPubkey.slice(0,64),'hex')).reverse());
		console.log("x=="+x.toString('hex'));
		var y = Buffer.from(new Uint8Array(new Buffer(hexPubkey.slice(64,128),'hex')).reverse());
		console.log("y=="+y.toString('hex'));
		var key = new ecc.ec('secp256r1').keyFromPublic({x:x,y:y});
		return KeyPair.genFromECCKey(key);
	}
	static genFromECCKey(key){
		var hexPrikey = key.getPrivate()?reverts(key.getPrivate().toString(16)): NaN;
		var hexPubkey = new Buffer(key.getPublic().getX().clone().toArray().reverse()).toString('hex').slice(0,64)
		hexPubkey = hexPubkey + new Buffer(key.getPublic().getY().clone().toArray().reverse()).toString('hex').slice(0,64);
		var hh=sha2.sha256(hexPubkey,'hex')
		var hexAddress =  hh.toString('hex').slice(0,40);	
		var kp=new KeyPair(hexPrikey,hexPubkey,hexAddress,key);
		return kp;
	}


	//生成随机密钥对
	static genRandomKey(options){
		var key = new ecc.ec('secp256r1').genKeyPair(options);
		return KeyPair.genFromECCKey(key);
	}
	//数据签名
	ecHexSign(hexMsg){
		var sc=sha2.sha256(hexMsg,'hex');
		var s = this._ecKey.sign(sc);
		var result = this.hexPubkey;
		result+= this.hexAddress;//new Buffer(utils.randomArray(20)).toString('hex')
		result+= new Buffer(s.r.clone().toArray().reverse()).toString('hex').slice(0,64);
		result+= new Buffer(s.s.clone().toArray().reverse()).toString('hex').slice(0,64);
		return result;
	}
	setNonce(nonce){
		this.nonce = nonce;
	}
	increNonce(){
		this.nonce = this.nonce+1;
	}
	//验证签名
	static ecHexVerify(hexMsg,hexSig){
		var hh=sha2.sha256(hexMsg,'hex').toString('hex');
		// console.log("hash="+hh);
		var x = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(0,64),'hex')).reverse());
		// console.log("x=="+x.toString('hex'));
		var y = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(64,128),'hex')).reverse());
		// console.log("y=="+y.toString('hex'));

		var r = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(168,232),'hex')).reverse());
		// console.log("r=="+r.toString('hex'));
		var s = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(232,296),'hex')).reverse());
		// console.log("s=="+s.toString('hex'));
		var key = new ecc.ec('secp256r1').keyFromPublic({x:x,y:y});
		var result = key.verify(hh,{r:r,s:s});
		if(result)
		{
			var hh=sha2.sha256(hexSig.slice(0,128),'hex')
			var hexAddress =  hh.toString('hex').slice(0,40);
			return hexAddress;
		}else{
			return NaN;
		}
	}
	//验证签名
	ecHexVerify(hexMsg,hexSig){
		var hh=sha2.sha256(hexMsg,'hex').toString('hex');
		if(hexSig.slice(0,128)!=this.hexPubkey){
			return false;
		}
		// console.log("hash="+hh);
		var x = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(0,64),'hex')).reverse());
		// console.log("x=="+x.toString('hex'));
		var y = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(64,128),'hex')).reverse());
		// console.log("y=="+y.toString('hex'));

		var r = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(168,232),'hex')).reverse());
		// console.log("r=="+r.toString('hex'));
		var s = Buffer.from(new Uint8Array(new Buffer(hexSig.slice(232,296),'hex')).reverse());
		// console.log("s=="+s.toString('hex'));
		var key = new ecc.ec('secp256r1').keyFromPublic({x:x,y:y});
		var result = key.verify(hh,{r:r,s:s});
		return result;
	}
}