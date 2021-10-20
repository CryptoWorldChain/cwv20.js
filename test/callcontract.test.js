const chai = require('chai');
const assert = chai.assert;
const chain=require('../dist/brewchain.js');
const rp = require('request-promise');

describe('Brewchain.contract', function () {

    let kp=null,passwd="000000";
    before(function() {
        kp=chain.KeyPair.genFromPrikey("ee353e42dab6de236e0071257bddeb1402dbf56de5d003ef2c08fc976f016380");
        chain.config.server_base ='http://c0:8000/fbs';
        chain.config.rpc_provider = rp;

    });

    describe('#contract.call()', function () {
        it("should transfer", async function () {
            console.log("kp.hexAddress %s",kp.hexAddress);
            console.log("kp.hexPrikey %s",kp.hexPrikey);
            console.log("kp.hexPubkey %s",kp.hexPubkey);
            console.log("kp.nonce %s",kp.nonce);
            let from={
                keypair:kp
            }
            
            let result=await chain.rpc.getBalance(kp.hexAddress);
            result=JSON.parse(result);
            from.keypair.nonce=result.nonce;
            let args={"contract":"940729720e2a83e20aC9Cd7C97bE46D3c3af4e6a","data":"a9059cbb000000000000000000000000fc85cd6c929847621f77bda95ea645f46df2af530000000000000000000000000000000000000000000000000de0b6b3a7640000"}

            chain.rpc.callContract(from,null,args).then(function(result){
                console.log(result)
            }).catch(function(error){
                console.log(error);
            })

        });
    });
});
