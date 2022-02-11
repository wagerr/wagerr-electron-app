'use strict';

const chalk = require('chalk');
const electron = require('electron');
const path = require('path');
const { say } = require('cfonts');
const { spawn } = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');

let electronProcess = null;
let manualRestart = false;

function logStats(proc, data) {
  let log = '';

  log += chalk.yellow.bold(
    `┏ ${proc} Process ${new Array(19 - proc.length + 1).join('-')}`
  );
  log += '\n\n';

  if (typeof data === 'object') {
    data
      .toString({
        colors: true,
        chunks: false
      })
      .split(/\r?\n/)
      .forEach(line => {
        log += '  ' + line + '\n';
      });
  } else {
    log += `  ${data}\n`;
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n';

  console.log(log);
}

function startRenderer() {
  return new Promise((resolve, reject) => {
    rendererConfig.mode = 'development';
    const compiler = webpack(rendererConfig);

    compiler.hooks.compilation.tap('compilation', compilation => {
      compilation.compiler.hooks.afterEmit.tapAsync(
        'html-webpack-plugin-after-emit',
        (data, cb) => {
          cb();
        }
      );
    });

    compiler.hooks.done.tap('done', stats => {
      logStats('Renderer', stats);
    });

    const server = new WebpackDevServer({
      historyApiFallback: true,
      hot: true,
      port: 9080,
      static: {
        directory: path.join(__dirname, '../'),
      }
    }, compiler);

    server.start();
    resolve();
  });
}

function startMain() {
  return new Promise((resolve, reject) => {
    mainConfig.mode = 'development';
    const compiler = webpack(mainConfig);

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      logStats('Main', chalk.white.bold('compiling...'));
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }

      logStats('Main', stats);

      if (electronProcess && electronProcess.kill) {
        manualRestart = true;
        process.kill(electronProcess.pid);
        electronProcess = null;
        startElectron();

        setTimeout(() => {
          manualRestart = false;
        }, 5000);
      }

      resolve();
    });
  });
}

function startElectron() {
  var args = ['--inspect=5858', path.join(__dirname, '../dist/main.js')];

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }

  electronProcess = spawn(electron, args);

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue');
  });
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red');
  });

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit();
  });
}

function electronLog(data, color) {
  let log = '';
  data = data.toString().split(/\r?\n/);
  data.forEach(line => {
    log += `  ${line}\n`;
  });
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('┏ Electron -------------------') +
        '\n\n' +
        log +
        chalk[color].bold('┗ ----------------------------') +
        '\n'
    );
  }
}

function greeting() {
  const cols = process.stdout.columns;
  let text = '';

  if (cols > 104) text = 'Wagerr-Dev ';
  else if (cols > 76) text = 'Wagerr-|Dev';
  else text = false;

  if (text) {
    say(text, {
      align: 'left',
      colors: ['Red', 'blueBright'],
      font: 'block',
      space: false
    });
  } else console.log(chalk.red.bold('Wagerr-Dev'));

  console.log(
    chalk.blue(
      '\n                         Money won is twice as sweet as money earned ;)'
    ) + '\n'
  );

  console.log(
    chalk.blue(
      '                                     .-------.    ______\n' +
        '                                    /   o   /|   /\\     \\\n' +
        '                                   /_______/o|  /o \\  o  \\\n' +
        '                                   | o     | | /   o\\_____\\\n' +
        '                                   |   o   |o/ \\o   /o    /\n' +
        '                                   |     o |/   \\ o/  o  /\n' +
        "                                   '-------'     \\/____o/"
    )
  );

  console.log('\n\n' + chalk.blue('Getting things ready....\n'));
}

function init() {
  greeting();

  Promise.all([startRenderer(), startMain()])
    .then(() => {
      startElectron();
    })
    .catch(err => {
      console.error(err);
    });
}

init();
