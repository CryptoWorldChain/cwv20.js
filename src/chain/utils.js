import crptoutils from 'minimalistic-crypto-utils';
import aesjs from 'aes-js';
import pbkdf2 from 'pbkdf2';
import sha2 from 'sha2'
import sha3 from 'sha3'
import Method from './method.js'
var __toArray = function(hexstr){
	return crptoutils.toArray(hexstr,'hex');
}

function __randomArray(length, max) {
	var rmax = max || 256;
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * rmax);
    });
}

export default{
	toHex: crptoutils.toHex,
	aes:aesjs,
	hexToArray: __toArray,
	pbkdf2:pbkdf2,
	sha2:sha2,
	sha3:sha3,
	randomArray:__randomArray
}