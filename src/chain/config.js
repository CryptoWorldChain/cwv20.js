
function config(){
	this.rpc_provider = NaN;
}

export default {
	config:config,	
	keystore_path:"./keystore",
	net_type:"testnet",
	server_base:"http://localhost:9001/fbs",
	store_path:"store",
}