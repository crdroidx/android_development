/*
 * Copyright (C) 2022 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const {merge} = require('webpack-merge');
const configCommon = require('./webpack.config.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const configDev = {
  mode: 'development',
  entry: {
    polyfills: './src/polyfills.ts',
    styles: ['./src/material-theme.scss', './src/styles.css'],
    app: './src/main_dev.ts',
  },
  devtool: 'source-map',

  externals: {
    fs: 'fs',
    path: 'path',
    crypto: 'crypto',
  },

  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      inlineSource: '.(css|js)$',
    }),
    new CopyPlugin({
      patterns: [
        'deps_build/trace_processor/to_be_served/trace_processor.wasm',
        'deps_build/trace_processor/to_be_served/engine_bundle.js',
        {from: 'src/adb/winscope_proxy.py', to: 'winscope_proxy.py'},
      ],
    }),
  ],
};

module.exports = merge(configCommon, configDev);
