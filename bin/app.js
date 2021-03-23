#!/usr/bin/env node

const https = require('https');
const chalk = require('chalk');
const fs = require('fs-extra');
const figlet = require('figlet');
const { log, logb, logr, logc } = require('./color-log');
const packageJSON = require('../package.json');
const { program } = require('commander');

const httpProxy = require('http-proxy');
const HttpProxyRules = require('http-proxy-rules');

const port = 443;

const options = {
  key: fs.readFileSync(__dirname + '/server.key', 'utf8'),
  cert: fs.readFileSync(__dirname + '/server.crt', 'utf8'),
};

logr(figlet.textSync('UNB-REVERSO').split('_').join('.'));

log(`${chalk.green('Versão:')} ${chalk.yellow(packageJSON.version)}`);

program.version(packageJSON.version);

program.option('-i, --init', 'Inicializa um arquivo de configuração de proxy reverso.');
program.option('-c, --conf <nome-arquivo>','Indica um arquivo de configuração.');
program.option('-s, --silent', 'Não imprime os logs de redirecionamento.');

program.parse(process.argv);

const fname = 'unb-reverso-conf.json';

if (program.init) {
  logb('Criando configuração de proxy padrão: ' + fname);
  if (fs.existsSync(fname)) {
    const msg = `Arquivo ${fname} já existe!`;
    logr(msg);
    process.exit(1);
  }
  fs.copySync(__dirname + '/' + fname, fname);
  logb('Arquivo criado com sucesso!');
  process.exit(0);
}

const confFile = program.conf || fname;
if (!fs.existsSync(confFile)) {
  const msg =
    `O arquivo de configuração '${confFile}' não existe!\n` +
    'Para utilizar o proxy, primeiro crie um arquivo de configuração utilizando a opção --init ' +
    'ou indique um arquivo de configuração existente com a opção --conf';
  logr(msg);
  process.exit(1);
}
logc('Configurações carregados do arquivo: ' + confFile);

let config = JSON.parse(fs.readFileSync(confFile));

fs.watchFile(confFile, () => {
  logb(`${confFile} alterado, configurações de proxy serão recarregadas.`);
  config = JSON.parse(fs.readFileSync(confFile));
});

if (!config.version || config.version !== 1) {
  const msg =
    'Arquivo de configuração em versão incorreta ou desatualizada. Favor gerar um novo arquivo de configuração utilizando o parâmetro --init';
  logr(msg);
  process.exit(1);
}

const proxy = httpProxy.createProxyServer({ secure: false });

https
  .createServer(options, function (req, res) {
    const host = req.headers['host'];

    const proxyRules = new HttpProxyRules(config[host]);

    const path = req.url;
    const target = proxyRules.match(req);
    if (target) {
      //somente imprime logs quando não houver opção silenciosa
      if(!program.silent) {
        log(chalk.green(path) + chalk.blue(' -> ') + chalk.green(target));
      }
      return proxy.web(req, res, {
        target: target,
      });
    }

    res.writeHead(500, { 'Content-Type': 'text/plain' });
    const msg = `Sem match para o ${path}.`;
    logr(msg);
    res.end(msg);
  })
  .listen(port, () => logb(`Escutando na porta ${port}\n`));

// Listen for the `error` event on `proxy`.
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain',
  });

  res.end('Algo deu errado, consulte o console.');
  logr('Erro: ');
  logr(req.url);
  logr(err);
  log('');
});
