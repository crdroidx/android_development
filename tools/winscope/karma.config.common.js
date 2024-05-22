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
const path = require('path');
const webpackConfig = require('./webpack.config.common');
delete webpackConfig.entry;
delete webpackConfig.output;

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      'karma-webpack',
      'karma-coverage-istanbul-reporter',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-sourcemap-loader',
    ],
    files: [
      {pattern: 'src/main_unit_test.ts', watched: false},
      {pattern: 'src/test/fixtures/**/*', included: false, served: true},
      {
        pattern: 'deps_build/trace_processor/to_be_served/engine_bundle.js',
        included: false,
        served: true,
      },
      {
        pattern: 'deps_build/trace_processor/to_be_served/trace_processor.wasm',
        included: false,
        served: true,
      },
    ],
    reporters: ['progress', 'coverage-istanbul'],
    preprocessors: {
      'src/main_unit_test.ts': ['webpack', 'sourcemap'],
    },
    coverageIstanbulReporter: {
      // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib
      reports: ['html', 'lcovonly', 'text-summary'],

      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: path.join(__dirname, 'coverage'),

      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,

      // Omit files with no statements, no functions and no branches covered from the report
      skipFilesWithNoCoverage: true,

      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbuljs/blob/73c25ce79f91010d1ff073aa6ff3fd01114f90db/packages/istanbul-reports/lib/html/index.js#L257-L261
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html',
        },
      },

      // enforce percentage thresholds
      // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
      thresholds: {
        emitWarning: true, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 100,
          lines: 100,
          branches: 100,
          functions: 100,
        },
        // thresholds per file
        each: {
          statements: 50,
          lines: 50,
          branches: 50,
          functions: 50,
        },
      },
    },

    verbose: true, // output config used by istanbul for debugging
    webpack: webpackConfig,
  });
};
