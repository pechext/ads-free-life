/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */

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
      path: path.join(__dirname, `../dist/${env.browser}`),
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
              ignore: ['**/.DS_Store']
            }
          }
        ]
      }),
      new webpack.DefinePlugin({
        __BUILD_DATE__: Date.now(),
        __BLOCKER_CONFIG_URL__: env.mode === 'production' ? "'http://localhost:8000/config.json'" : "'https://raw.githubusercontent.com/pechext/ads-free-life/refs/heads/dev/config.json'",
      }),
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