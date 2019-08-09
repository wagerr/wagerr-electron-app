'use strict';

process.env.NODE_ENV = 'production';

const { say } = require('cfonts');
const chalk = require('chalk');
const del = require('del');
const webpack = require('webpack');
const Listr = require('listr');

const mainConfig = require('./webpack.main.config');
const rendererConfig = require('./webpack.renderer.config');

const doneLog = chalk.bgGreen.white(' DONE ') + ' ';
const errorLog = chalk.bgRed.white(' ERROR ') + ' ';
const okayLog = chalk.bgBlue.white(' OKAY ') + ' ';
const isCI = process.env.CI || false;

if (process.env.BUILD_TARGET === 'clean') clean();
else build();

function clean() {
  del.sync(['release/*']);
  console.log(`\n${doneLog}\n`);
  process.exit();
}

function build() {
  let results = '';

  greeting();

  del.sync(['dist/*', '!.gitkeep']);

  const tasks = new Listr(
    [
      {
        title: 'Building main process',
        task: () =>
          pack(mainConfig)
            .then(result => {
              results += result + '\n\n';
            })
            .catch(err => {
              console.log(`\n  ${errorLog}failed to build main process`);
              console.error(`\n${err}\n`);
              process.exit(1);
            })
      },
      {
        title: 'Building renderer process',
        task: () =>
          pack(rendererConfig)
            .then(result => {
              results += result + '\n\n';
            })
            .catch(err => {
              console.log(`\n  ${errorLog}failed to build renderer process`);
              console.error(`\n${err}\n`);
              process.exit(1);
            })
      }
    ],
    { concurrent: true }
  );

  tasks.run().then(() => {
    console.log(`\n\n${results}`);
    console.log(
      `${okayLog}take it away ${chalk.yellow('`electron-builder`')}\n`
    );
  });
}

function pack(config) {
  return new Promise((resolve, reject) => {
    config.mode = 'production';
    webpack(config, (err, stats) => {
      if (err) reject(err.stack || err);
      else if (stats.hasErrors()) {
        let err = '';

        stats
          .toString({
            chunks: false,
            colors: true
          })
          .split(/\r?\n/)
          .forEach(line => {
            err += `    ${line}\n`;
          });

        reject(err);
      } else {
        resolve(
          stats.toString({
            chunks: false,
            colors: true
          })
        );
      }
    });
  });
}

function greeting() {
  const cols = process.stdout.columns;
  let text = '';

  if (cols > 104) text = 'Wagerr-Dev-Build ';
  else if (cols > 76) text = 'Wagerr-|Dev-|Build';
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
        "                                   '-------'     \\/____o/\n\n"
    )
  );
}
