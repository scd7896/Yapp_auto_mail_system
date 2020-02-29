const path = require('path')
const fs = require('fs')
const files= fs.readdirSync(__dirname+'/src/pages')

var obj = files.reduce((o, val)=> { 
    const key = val.split('.')[0]
    o[key] = __dirname+'/src/views/'+val; 
    return o; 
}, {});

module.exports = {
    mode: "development", devtool: "inline-source-map",
    entry: {
        ...obj
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".css", ".scss"]
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.ts(x?)$/,
                exclude: "/node_modules/",
                use: [
                    "awesome-typescript-loader",
                ]
            },
            {
                test: /\.scss$/,
                
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",

                    },
                    {
                        loader: "sass-loader"
                    }     
                ]
            },
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist',
    },
    
};
