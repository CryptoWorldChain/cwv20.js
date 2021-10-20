const chai = require('chai');
const bipp=require('../src/chain/bip44.js')
const assert = chai.assert;
const chain=require('../dist/brewchain.js');

describe('Keystore', function () {
    let kp=null,passwd="000000";
    before(function() {
        kp=chain.KeyPair.genRandomKey();
    });
    it("should keystore.save and ", async function () {
        console.log("kp.hexAddress %s",kp.hexAddress);
        console.log("kp.hexPrikey %s",kp.hexPrikey);
        console.log("kp.hexPubkey %s",kp.hexPubkey);
        console.log("kp.nonce %s",kp.nonce);
        let keystore=chain.keystore.exportJSON(kp,passwd);
        console.log("keystore=%s",JSON.stringify(keystore))
        
        console.log(chain.keystore.json2KeyPair(keystore,passwd));
    });
});