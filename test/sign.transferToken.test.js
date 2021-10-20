const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');
const rp = require('request-promise');

describe('Brewchain.contract', function () {

    let kp=null,passwd="000000";
    before(function() {
        kp=chain.KeyPair.genFromPrikey("ee353e42dab6de236e0071257bddeb1402dbf56de5d003ef2c08fc976f016380");
        chain.config.server_base ='http://f0:8000/fbs';
        chain.config.rpc_provider = rp;

    });

    describe('#contract.call()', function () {
        it("should transfer", async function () {
            let from={
                keypair:kp
            }
            
            let result=await chain.rpc.getBalance(kp.hexAddress);
            result=JSON.parse(result);
            from.keypair.nonce=result.nonce;
            
            let token="0x065a4c2d46edb9344dd50f42cad551b5799d3460";
            // // token="0x7accab72bab4d2738c0f031a259f8c6bc93119fb";
            let args={"tos":["16fcf012f12928b6a3f07e801fd531ade6ef198c"], "values":["01b5e3af16b1880000"]};
            console.log(chain.rpc.signTransferToken(from,token,args));
        });
    });
});
