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
            let from={
                keypair:kp
            }
            
            let result=await chain.rpc.getBalance(kp.hexAddress);
            result=JSON.parse(result);
            from.keypair.nonce=result.nonce;
            
            var args=[
                {"address":"0x527b9d7da04285544f9ea1b6f75b8b41649ad4b0",
                "amount":"300000000000000000000000"}
            ]
            // Buffer.from('huobi transfer',"utf8").toString("hex")
            chain.rpc.transfer(from,null,args).then(function(result){
                console.log("result",result)
            })
        });
    });
});
