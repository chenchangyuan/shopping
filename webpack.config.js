const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const config = {
    //配置的entry单入口webpack4默认 ./src/index.js
    // webpack打包输出配置
    output:{
        path:path.join(__dirname,'./dist'),
        publicPath:'/dist/',
        filename:'main.js'
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
                options:{
                    loaders:{
                        css:[
                            'vue-style-loader',
                            'mini-css-extract-plugin',
                            'css-loader'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                //数组形式的话，编译是从后往前。
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test:/\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                //文件小于1k就以base64形式加载
                loader:'url-loader?limit=1024'
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin('main.css'),
        new VueLoaderPlugin()
    ]
};
module.exports = config;