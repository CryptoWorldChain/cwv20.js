const chai = require('chai');
const bipp=require('../src/chain/bip44.js')
const assert = chai.assert;
const chain=require('../dist/brewchain.js');

describe('Mnemonic.to.prikey', function () {
    it("recovery.to.prikey", async function () {
        let mainkey=bipp.mnemonicToHDPrivateKey("like dragon virtual business permit force dirt demise blame comfort invite foster","")
        var accountKey=chain.KeyPair.genCVNFromPrikey(bipp.getPrivateKey(mainkey,0))
        assert.equal("ad7bfffc46e08267e90a4fe2139229a284ecdf35",chain.rpc.removeCVN(accountKey.hexAddress))
        assert.equal("d52c7f439950735e0fde27c4662c4d9c39ff972e1133ff2844dd9468c4c3fdf6",accountKey.hexPrikey)
    });
});