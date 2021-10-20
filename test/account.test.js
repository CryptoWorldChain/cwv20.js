const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');

describe('Brewchain.accounts', function () {

    describe('#generateAccount()', function () {
        it("should generate a new account", async function () {
            const kp=chain.KeyPair.genRandomKey();
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
        });

        it("should generate account from prikey", async function () {
            const kp=chain.KeyPair.genFromPrikey("3f1caff94cc871ae796c61ddbf360e0bd515eb26047215634e7386e4a1ea0ab8");
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
        });

        it("should generate a new account for cvn", async function () {
            const kp=chain.KeyPair.genCVNRandomKey();
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
        });

        it("should generate account from prikey for cvn", async function () {
            const kp=chain.KeyPair.genCVNFromPrikey("3f1caff94cc871ae796c61ddbf360e0bd515eb26047215634e7386e4a1ea0ab8");
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
        });
    });
});
