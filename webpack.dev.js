const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 抽离css
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // build前清理旧build文件

//编译代码的基础配置
module.exports = {
  mode: "development",
  entry: {
    index: path.resolve(__dirname, `./src/index.js`),
  },
  output: {
    path: path.join(__dirname, `./dist/`),
    filename: "script/[name].[chunkhash:8].v1.js",
    chunkFilename: "script/[name].[chunkhash:8].chunk.v1.js",
    publicPath: "/",
    globalObject: "this",
  },
  externals: {
  },
  //调试工具,开发环境开启eval-source-map,生产构建时不开启
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      // favicon: "public/favicon.ico",
      filename: `index.html`,
      template: 'src/index.html',
      chunks: 'all',
      //防止各site项目一样时，不生成html文件
      cache: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
      hash: true,
      templateParameters: {
        publicPath: `/`,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles/[name].[fullhash:5].css",
      chunkFilename: "styles/[name].[fullhash:5].css",
      ignoreOrder: true
    }),
  ],
  resolve: {
    //设置模块导入规则，import/require时会直接在这些目录找文件
    modules: [path.resolve("/src"), "node_modules"],
    //import导入时省略后缀
    extensions: [".ts", ".tsx", ".js", ".jsx", ".react.js", ".css", ".json"],
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    },
    static: path.join(__dirname, 'dist'), 
    port: 3001,
    compress: true, 
    historyApiFallback: true, 
    hot: true, 
    https: false, 
  },
  module: {
    //设置所以编译文件的loader
    rules: [
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, 
          "css-loader", 
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: {
                  'primary-color': 'sandybrown',
                  'link-color': 'rebeccapurple',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true
              }
            }
          }
        ],
      },
      {
        test: /\.[jt]sx?$/,
        use: ["babel-loader?cacheDirectory"],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "imgs/[name].[ext]",
              limit: 2048,
              publicPath: "/",
              fallback: "file-loader",
            },
          },
        ],
      },
    ],
  },
  performance: {
    //性能设置,文件打包过大时，不报错和警告，只做提示
    hints: false,
  },
};
