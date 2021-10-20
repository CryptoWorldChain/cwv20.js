const chain=require('./dist/brewchain.js');
const fs=require('fs');
var rp = require('request-promise');
const md5 = require('md5');
const { start } = require('repl');

const BN = require('bn.js');
console.log(new BN("100000000000000000000").toString(16));
//设置节点地址
chain.config.server_base ='http://c0:8000/fbs';
chain.config.rpc_provider = rp;
// var kp=chain.KeyPair.genRandomKey()
//根据私钥获取地址
// var kp = chain.KeyPair.genCVNFromPrikey("79211e47216f5c13c85650fac839078ad6ae2dc074ca4bd1e7817fbdfe8f6e51")
// var kp = chain.KeyPair.genCVNFromPrikey("84a8d84288b9db81083004b0cf70ac02e696760207d689d9a4e1a773ebf80264");
// var kp = chain.KeyPair.genCVNFromPrikey("565ab31d16d4b8bc408ab5ce84ef265f58f337c20386f3dfdc7eb6fe9aad5280");
var kp= chain.KeyPair.genCVNFromPrikey("e36656e717c57298c14180112c599341fc5a2b59c87af361bd1ca566571150e9");
//删除地址前缀
kp.hexAddress=chain.rpc.removeCVN(kp.hexAddress);
var from={
    keypair:kp
}
const file="/Users/camulos/Downloads/1.txt";
const filename="1.txt";
const stats = fs.statSync(file);
var config={
    SECTOR_BYTE_SIZE:512,
    PAGE_SECTOR_COUNT:1024,
    ZK_MERKLE_MIN_TREE_DEPTH:4,
    ZK_MERKLE_MAX_TREE_DEPTH:4,
    SECTOR_COUNT_ONE_BLOCK:4194304,
    buffer_send_size:8 * 1024 * 1024
}
var MaxSectorRange=[],MaxByteRange=[],LayerRange=[];
function init(){
    config.BYTE_SIZE_PRE_BLOCK=config.SECTOR_COUNT_ONE_BLOCK * config.SECTOR_BYTE_SIZE;
    for(let i=config.ZK_MERKLE_MIN_TREE_DEPTH;i<=config.ZK_MERKLE_MAX_TREE_DEPTH;i++){
        let leaveCount = Math.pow(2, i);
        MaxSectorRange.push(leaveCount);
        let max_size = config.SECTOR_BYTE_SIZE * leaveCount;
        
        MaxByteRange.push(max_size);
    }
    
    let deep_byte_size = 0;
    let z = config.ZK_MERKLE_MAX_TREE_DEPTH;
    while (deep_byte_size < config.BYTE_SIZE_PRE_BLOCK) {
        let leaveCount = Math.pow(2, z);
        deep_byte_size = config.SECTOR_BYTE_SIZE * leaveCount;
        LayerRange.push(leaveCount);
        z = z + 1;
    }
    config.Page_Byte_Size=config.PAGE_SECTOR_COUNT*config.SECTOR_BYTE_SIZE;
}

/**
 * 申请上传
 */
async function reqUpload(){

    let args = { 
        "tokenAddrOrSymbol":"EVS","nodeSize":stats.size,"nodeName":filename,
        "extDesc":"test","replicas":0,
        "slices":1,
        "tos":["d77ae7bfe37947fdf088afb4c84875f2a2376e43"],
        "values":["0x0"],
        "permissions":"5",//4=公开 5=购买，需要签名node_uuid 
        "licenseFee":"10000000000000000000",
        "licensePrice":"100000000000000000000"
    }
    //获取带签名请求参数 返回object
    let req=chain.rpc.signReqUpload(from,args);
    console.log(req)
    let options = {
        method: 'POST',
        uri: chain.config.server_base+'/poc/pbreq.do',
        body: JSON.stringify(req)
    };
    return await rp(options);
}
function calcLevelAndZipLayer(size){
    let mrkDeep=0;
    let sectorCount = Math.ceil((1.0 * size) / config.SECTOR_BYTE_SIZE);
    for(mrkDeep=0;mrkDeep<MaxSectorRange.length;mrkDeep++){
        if(MaxSectorRange[mrkDeep]>sectorCount){
            break;
        }
    }
    mrkDeep=mrkDeep+config.ZK_MERKLE_MIN_TREE_DEPTH;

    let zip_layer = 0;
    if (mrkDeep >= config.ZK_MERKLE_MAX_TREE_DEPTH) {
        mrkDeep = config.ZK_MERKLE_MAX_TREE_DEPTH;
        for (zip_layer = 0; zip_layer < LayerRange.length; zip_layer++) {
            if (LayerRange[zip_layer] >= sectorCount) {
                break;
            }
        }
    }
    let deep=Buffer.alloc(2)
    deep[0] = mrkDeep;
    deep[1] = zip_layer;
    return deep;
}
/**
 * 获取文件roothash
 * @param {*} fp 
 */
function calcRootHash(offset,segmentSize){

    let deepResults = calcLevelAndZipLayer(segmentSize);
    let level=deepResults[0];
    let ziplayer=deepResults[1];

    let pageByteCount = Math.pow(2, ziplayer)  * config.SECTOR_BYTE_SIZE;
    console.info("level=" + level + ",ziplayer=" + ziplayer + ",size=" + segmentSize + ",pageByteCount=" + pageByteCount);

    if (pageByteCount > 0) {
        let levels=[];
        let leaveCount = Math.pow(2, level);
        for (let i = 0; i < level; i++) {
            levels[i] = [];
        }

        if(segmentSize<=0){
            segmentSize=stats.size-offset;
        }
        let blockdata = Buffer.alloc(config.Page_Byte_Size);
        let cc=1,totalReadSize=0;

        while (totalReadSize < segmentSize) {
            let blocksize=0;
            let zip_code=Buffer.alloc(32);
            while (blocksize < pageByteCount && totalReadSize < segmentSize) {
                let rsize = raf.read(blockdata, 0, Math.min(blockdata.length, (int)(segmentSize - totalReadSize)));
                totalReadSize += rsize;
                while (rsize < blockdata.length && totalReadSize < segmentSize) {
                    let trsize = raf.read(blockdata, rsize, Math.min(blockdata.length - rsize, (int)(size - totalReadSize)));
                        rsize += trsize;
                        totalReadSize += trsize;
                }
                blocksize += rsize;
                zip_code = enc.sha3(BytesHelper.appendBytes(blockdata, zip_code));
            }
            levels.push(zip_code);
            cc = cc + 1;
        }
        for (let i = levels[level - 1].length; i < leaveCount; i++) {
            levels[level - 1].push(Buffer.alloc(32));
        }

        for (let i = level - 1; i > 0; i--) {
            for (let j = 0; j < levels[i].size(); j += 2) {
                // let input1 = levels[i][j];
                let joinHash=Buffer.concat(levels[i][j],levels[i][j + 1]);
                // input.insert(input.end(), levels[i][j+1].begin(), levels[i][j+1].end());
                levels[i - 1].push(SHA256Util.genHash(joinHash));

            }
        }
        let jsoinHash=Buffer.concat(levels[0][0],levels[0][1])
        // byte[] joinHash = BytesHelper.appendBytes(levels[0].get(0), levels[0].get(1));
        return SHA256Util.genHash(joinHash);
    }else{
        return null;
    }
}

async function ensureEVNodeReady(nodeuuid,counter){
    let sign=Buffer.from(from.keypair.ecHexSign(nodeuuid),'hex').toString("hex")
    let options = {
        method: 'POST',
        uri: chain.config.server_base+'/poc/pbqnd.do',
        body: JSON.stringify({"node_uuid":nodeuuid,"sign":sign})
    };
    let result =await rp(options);
    // console.log("result="+result)
    result=JSON.parse(result);
    console.log("result="+JSON.stringify(result));
    let segment_size=0
    result.segment.forEach(element => {
        segment_size+=element.segment_size;
    });
    if (counter>30){
        return null;
    }else{
        if(result.ev_node.slices*(
            result.ev_node.replicas<=result.ev_node.segment_count 
            && segment_size==result.ev_node.node_size)){
            return result;
        }else{
            console.log("evnode not finished upload:replica=" + result.ev_node.segment_replia_count
            + ",segmentcount=" + ret.ev_node.segment_count + ",slice="
            + ret.ev_node.slices);
            ensureEVNodeReady(nodeuuid,counter+1);
        }
    }

}
let badUrls=new Map();
async function fileSegmentGet(nodeIdx,segment,uriByAddr){
    let read_offset=0,hostTestCounter=0;
    while(read_offset<segment.segment_size && hostTestCounter<segment.miners_address.length){
        let reqGetSegment={};
        reqGetSegment.segment_uuid=segment.segment_uuid;
        reqGetSegment.node_uuid=segment.node_uuid;
        reqGetSegment.offset=read_offset;
        reqGetSegment.limit=Math.min(segment.segment_size - read_offset, segment.segment_size);
        //sign
        reqGetSegment.sign=Buffer.from(from.keypair.ecHexSign(segment.node_uuid),'hex').toString("hex");

        let url="",foundData=false,ret;
        for(let i=0;i<segment.miners_address.length*3;i++){
            url=uriByAddr.get(segment.miners_address[(nodeIdx + i) % segment.miners_address.length])
            //生产不一定是 5100 和 8000
            url=url.replace(/tcp/,"http").replace(/51/,"80")
            if(badUrls.has(url)){
                continue;
            }
            let options={
                method: 'POST',
                uri: url+'/fbs/poc/pbget.do',
                body: JSON.stringify(reqGetSegment)
            }
            ret=await rp(options)
            ret=JSON.parse(ret);
            if(ret.ret_code==1){
                foundData=true;
                break;
            }else{
                console.error("[EVFS] error in fetch file from host=" + url.replaceAll("http://", ""));
                badUrls.set(url,new Date().getTime());
            }
        }
        if (!foundData) {
            console.error("cannot found segment from miners.");
            return;
        }
        
        if(ret.data.length>0){
            let rawdata=Buffer.from(ret.data.substr(2),"hex");
            read_offset+=rawdata.length;
            if(read_offset>=segment.segment_size){
                hostTestCounter++;
                if("0x".concat(md5(rawdata).toString("hex"))==Buffer.from(segment.md5)){
                    console.info("get segment success, md5 equal.");
                    hostTestCounter = segment.miners_address.length+10;
                }else{
                    console.info("get segment failed, md5 not equal");
                    read_offset = 0;
                }
            }
            return rawdata;
            
        }else{
            break;
        }
    }

}
// 16进制转字符串
function hex2str(hex) {
　　var trimedStr = hex.trim();
　　var rawStr = trimedStr.substr(0,2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
　　var len = rawStr.length;
　　if(len % 2 !== 0) {
　　　　alert("Illegal Format ASCII Code!");
　　　　return "";
　　}
　　var curCharCode;
　　var resultStr = [];
　　for(var i = 0; i < len;i = i + 2) {
　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16);
　　　　resultStr.push(String.fromCharCode(curCharCode));
　　}
　　return resultStr.join("");
}
async function reqDownload(nodeuuid){
    //获取分片信息
    let evnodeInfo=await ensureEVNodeReady(nodeuuid,0);
    let uriByAddr=new Map();
    let filename='./file/' + hex2str(evnodeInfo.ev_node.node_name);
    fs.openSync(filename,'w');
    let stream=fs.createWriteStream(filename,{flags:'a',end:false});
    
    for(let i=0;i<evnodeInfo.miner_uri.length;i++){
        let addr=evnodeInfo.miner_addr[i];
        uriByAddr.set(addr,evnodeInfo.miner_uri[i]);
    }
    // 串行下载分片，可以改为并行下载
    for(let i=0;i<evnodeInfo.ev_node.slices;i++){
        let data=await fileSegmentGet(i,evnodeInfo.segment[i],uriByAddr);
        fs.appendFileSync(filename, data);
    }
    return evnodeInfo;
}

init();

/**
 * 上传文件
 * @param {*}} evsegment 
 */
function tryUpload(tryidx,fp,uriByAddr){
        // console.log("start="+seek+",end="+end);
    let uri=uriByAddr.get(fp.miners_address[(tryidx) % fp.miners_address.length])
    if (uri===""){
        console.log("cannot get uri ");
        return;
    } 
    // let dataRootHash=calcRootHash(fp.offset,fp.segment_size);
    console.log("startup to upload ,partid=" + tryidx +",offset=" + fp.offset + ",size=" + fp.segment_size + ",seg.uuid=" + fp.segment_uuid);
    let bb=Buffer.alloc(config.buffer_send_size);
    uri=uri.replace(/tcp/,"http").replace(/51/,"80");
    let roothash=Buffer.from(md5("123456"))
    let address=Buffer.from(from.keypair.hexAddress,"hex")
    let signData=from.keypair.ecHexSign(Buffer.concat([address,roothash],roothash.length+address.length));
    fp.sign=signData;
    fp.root_hash=roothash.toString("hex");
    let seek=fp.offset,endPos=seek+fp.segment_size;
    let readstream = async function(){
        return new Promise((resolve, reject) => {
            let size = Math.min(bb.length, endPos-seek);
            end=seek+size;
            let chunks="",len=0;
            let read = fs.createReadStream(file, { start: seek, end: end });
            read.setEncoding('hex');
            // read.resume();//让文件流开始'流'动起来
            read.on('data',chunk =>{//监听读取的数据
                chunks+=chunk;
            })
            read.on('end',()=>resolve(chunks));
            read.on('error',error=>reject(error));
        });
    }
    let data=async function(){
        let result = await readstream();
        // console.log(result);

        doneCallback(fp,result,seek,end);
        return result;
    }
    data();  
    seek+=end;
    return true;
}
  
function doneCallback(fp,data){
    // console.log("neirong="+data);
    fp.md5=md5(Buffer.from(data,"hex"));
    let req={};
    req.contents=data;
    req.offset=0;
    req.from_client=true;
    req.cur_part=fp;

    let options = {
        method: 'POST',
        uri: chain.config.server_base+'/poc/pbput.do',
        body: JSON.stringify(req)
    };
    rp(options).then(function(result){
        console.log("RespPutSegment="+result);
    }).catch(function(err){
        console.log("upload error="+err);
    })
}
let upload=async function(){
    //申请上传
    let evnodeInfo = await reqUpload();
    evnodeInfo=JSON.parse(evnodeInfo);
    console.log(evnodeInfo);
    let uriByAddr=new Map(),pubkeyByAddr=new Map();
    for(let i=0;i<evnodeInfo.miner_uri.length;i++){
        let addr=evnodeInfo.miner_addr[i];
        uriByAddr.set(addr,evnodeInfo.miner_uri[i]);
        pubkeyByAddr.set(addr,evnodeInfo.miner_pub_keys[i]);
    }
    console.log(uriByAddr);

    for(let i=0;i<evnodeInfo.segments.length;i++){
        let retryCount = 3;
        for (j = 0; j < evnodeInfo.segments[i].miners_address.length * retryCount; j++) {
            if (tryUpload(j % retryCount, evnodeInfo.segments[i],uriByAddr,doneCallback)) {
                break;
            }
        }
    }
}
/**
 * 授权
 */
let authorization=function(){
    let args = { 
        "nodeUuid":"0xcccfc3aaf874250fba6dee164c95fdeae21cbc6fe6b2ceef72d40eea8ce511f9"
    }
    chain.rpc.getBalance(from.keypair.hexAddress).then(function(result){
        result=JSON.parse(result);
        from.keypair.nonce=result.nonce;
        let sign=JSON.stringify(chain.rpc.signEvfsAuth(from,args));
        console.log(sign)
        let options = {
            method: 'POST',
            uri: chain.config.server_base+'/tct/pbmtx.do',
            body: sign
        };

        // console.log(JSON.stringify(chain.rpc.signDecode(chain.rpc.signEvfsAuth(from,args))))
        rp(options).then(function(m){
            console.log(m)
        });
    }).catch(function (err) {
        console.log(err)
    });
}
let updatePrice=function(){
    let args = { 
        "nodeUuid":"0xcccfc3aaf874250fba6dee164c95fdeae21cbc6fe6b2ceef72d40eea8ce511f9",
        "licenseFee":"1000000000000000000",
        "licensePrice":"5000000000000000000"
    }
    chain.rpc.getBalance(from.keypair.hexAddress).then(function(result){
        result=JSON.parse(result);
        from.keypair.nonce=result.nonce;
        let sign=JSON.stringify(chain.rpc.signEvfsUpdatePrice(from,args));
        console.log(sign)
        let options = {
            method: 'POST',
            uri: chain.config.server_base+'/tct/pbmtx.do',
            body: sign
        };

        rp(options).then(function(m){
            console.log(m)
        });
    }).catch(function (err) {
        console.log(err)
    });
}
let download=async function(){
    // let nodeuuid="http://d0.fclink.cn/fbs/file/pbdownload.do?node_uuid=ef09faf3f7c2156988d22a478acddd5006cd46edd6809134100b1c3d094de8f1";
    // let nodeuuid='ef09faf3f7c2156988d22a478acddd5006cd46edd6809134100b1c3d094de8f1';
    // let nodeuuid='f397ea85daf3baa367586ab2ac4829767692ae3f661634d516f4049b43358006';
    // let nodeuuid='98109e55d4df285d30f2a5cea280772dffc579866faa35bda4667a3d5437230e';
    // let nodeuuid='0x6fddc9def4d7e735e8ae924efad5905b092201b5b2a81361d8f4145cf9782253';
    let nodeuuid='0xc6fa67d03d96580cae4d3782712793ae1c0b5add62c0e085d14da883124e6864';
    // let nodeuuid='e39dc95e5ded5675dbc397186828c09ee9a536577c6e4e6d85fa66703e31d05b';
    let reqdown = await reqDownload(nodeuuid);
}
// reqUpload().then(function(result){
//     console.log(result)
// })
// upload();
download();
// authorization();
// updatePrice();
// let aaa=chain.rpc.signDecode({"tx":"127808d4d20112140d2e8f78061eda7ca0f07bfa56858ff985953fc130063a53080f12140d2e8f78061eda7ca0f07bfa56858ff985953fc11a14065a4c2d46edb9344dd50f42cad551b5799d3460fa01221a20cccfc3aaf874250fba6dee164c95fdeae21cbc6fe6b2ceef72d40eea8ce511f948e9bdbcf1f52e1a9401e2167864dd1c3b4a881dcfcf7638f1e1a063e7559a839744ade08d1e9430be2a3d55ba9a12abaa9cc1f34c988281605c3833ab3f96d36e73fa27be636eb022de0d2e8f78061eda7ca0f07bfa56858ff985953fc16339a3e61385503ceb99834961e3188c630cbd0452291613787913372423436a85914990cbf6a1139e9d0d13555564d14ec24dcfc5c30217f3ae254010c40f6d"})
// console.log(Buffer.from(aaa.body.address).toString("hex"))
//获取签名
// var ecdataSign=from.keypair.ecHexSign(req)
// console.log(Buffer.from(ecdataSign,"hex"));
let nodeid='0xfcbc1b7cb0bffb9c3beed6b6c8458014a90f8cf17352624555669d19758efd2c';
let sign=Buffer.from(from.keypair.ecHexSign(nodeid),'hex').toString("hex");
console.log("sign="+sign);
console.log(from.keypair.ecHexVerify(nodeid,sign));
