var HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')


const path = require('path');
module.exports = {
	mode: "production",
  	entry: './src/browser.js',
	optimization: {
	    //minimizer: [
	    //  new TerserPlugin({ /* your config */ })
	    // ]
	},
	devServer: {
	    contentBase: path.join(__dirname, 'dist'),
	    compress: true,
	    port: 9000
	 },
 	module: {
	    rules: [
	      {//load keystore
	        test: /\.(json)$/,
	        include:[path.resolve(__dirname, "keystore")],
	       	loader: 'json-loader',
            options: {
            	outputPath:'keystore'
            }
	      },
	      {
	        test: /\.(png|jpg|gif)$/,
	       	loader: 'file-loader',
	       	include:[path.resolve(__dirname)],
            options: {
            	outputPath:'pbs'
            }
	      },
	      {
	        test: /\.(proto)$/,
	       	loader: 'raw-loader',
	       	include:[path.resolve(__dirname, "src/chain/proto")],
	      },

	    ],
	 },
	resolve: {//import的时候不需要加上js
   		 extensions: ['.wasm', '.mjs', '.js', '.json'],
   		 alias:{
   		 	Keystore: path.resolve(__dirname, 'keystore'),
   		 }
  	},
  	output: {
    	filename: 'brewchain-browser.js',
    	path: path.resolve(__dirname, 'dist'),
    	library:'chain',

    	// libraryTarget:'commonjs2',
    	// libraryExport:'default'
  	},
  	node: {
		    console: 'mock',
		    fs: 'empty',
		    net: 'empty',
		    tls: 'empty'
		},


  	plugins: [new HtmlWebpackPlugin(),


		// new CopyWebpackPlugin([
		// 	{
		// 	  from: "keystore/",
		// 	  to: 'keystore',
		// 	  test: /([^/]+)\/(.+)\.json$/,
		// 	  ignore:['.DS_Store']
		// 	}
		// ],{}),



  	],

};
