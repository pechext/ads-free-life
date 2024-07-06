const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => {
  const config = { 
    mode: env.mode ? env.mode : 'development',
    watch: env.watch ? env.watch === 'true' : false,
    entry: {
      content: path.resolve(__dirname, '..', 'src', 'content.ts'), 
      background: path.resolve(__dirname, '..', 'src', 'background.ts'),
      popup: path.resolve(__dirname, '..', 'src', 'popup/index.tsx'),
    },
    output: {
      path: path.join(__dirname, '../dist'),
      filename: '[name].js',
      clean: true
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: '.', 
            to: '.', 
            context: 'public', 
            globOptions: {
              ignore: [ '**/.DS_Store' ]
            }
          }
        ]
      }),
      new webpack.DefinePlugin({})
    ],
  }

  if (env.mode === 'development') config.devtool = 'inline-source-map';
  if (env.mode === 'production') config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {          
          compress: { drop_console: true },
        }
      }),
    ],
  };

  return config;
};