const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: {
    app: './src/index.js'
  },
  externals: {
    // 要引入的资源的名字：该模块提供给外部引用的名字(由对应的库自定)
    'vue': 'Vue',
    'element-ui': 'ElementUI',
    'js-cookie': 'Cookies',
    'jQuery': '$',
  },
  output: {
    filename: '[name].js',
    path: __dirname +'/dist/'
  },
  module: {
    rules: [
      {
        test: /(\.css|\.s[ac]ss)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
  ],
  optimization:{
    minimize: false, // 禁止压缩混淆源代码
  }
}