const webpack = require("webpack")
const path = require('path'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports={
	//入口文件
	entry:'./client/src/js/app.js',
	//出口文件
	 output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
	//需要依赖的插件或装载器
	module:{
		loaders:[
				{test:/\.(css)$/,
					
					loader:'style-loader!css-loader'
				},
				{test:/\.(less)$/,

					loader:'less-loader'
				},
				{
					test:/\.js$/,
					loader:'babel-loader',
					exclude:/node_modules/,
					query:{
						presets:['es2015']
					}
				},
				 {test: /\.(eot|svg|png|svg|jpg|gif)$/,
				 	loader: "file-loader" 
				 },
				 	{
				 		test: /\.(ttf|woff|woff2)$/,
				
				 	loader: "url-loader" },
				]
	},

	  plugins: [



		  /* new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
              title: 'Output Management'
             }),*/
	      /*new webpack.HotModuleReplacementPlugin(),*/
	      new webpack.ProvidePlugin({
	          "$": "jquery",
	          "jQuery": "jquery",
	          "window.jQuery": "jquery",
	          "highcharts":'Highcharts',
	          "Highcharts":'highcharts',
			  "baseData":'baseData'
	      })
  ]
}
 