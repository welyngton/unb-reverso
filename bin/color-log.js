const chalk = require('chalk');

global.stepCounter = 0;

const log = (msg, color, opts = {}) => {
  if (opts.verbose && !process.env.VERBOSE)
    return;

  // Só vai colorir se uma cor for informada e não for uma execução de testes
  msg = color && !global.jasmine ? chalk[color](msg) : msg;

  const preMsg = opts.stepCounter
    ? `(${++global.stepCounter}) `
    : '';

  console.log(`${preMsg}${msg}`);
};

const logd = (msg, opts) => log(msg, null, opts); // log *d*efault - no color
const logb = (msg, opts) => log(msg, 'blue', opts);
const logg = (msg, opts) => log(msg, 'green', opts);
const logy = (msg, opts) => log(msg, 'yellow', opts);
const logr = (msg, opts) => log(msg, 'red', opts);
const logc = (msg, opts) => log(msg, 'cyan', opts);
const loggr = (msg, opts) => log(msg, 'grey', opts);

module.exports = {
  log,
  logd,
  logb,
  logg,
  logr,
  logc,
  logy,
  loggr
};
