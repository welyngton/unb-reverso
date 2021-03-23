#!/usr/bin/env node

const semver = require('semver');
if (!semver.satisfies(semver.valid(process.version), '>= 10')) {
  console.log('Versão mínima do node -> 10.x');
  console.log('Versão instalada -> ' + process.version);
  console.log(
    'Versão do node não satisfeita, atualize para uma versão mais recente (>= 10) para utilizar o gaw-reverse.'
  );
  process.exit(1);
}

const https = require('https');
const http = require('http');
const request = require('request');
const chalk = require('chalk');
const figlet = require('figlet');
const { log, logb, logr, logc, logy, logg } = require('./color-log');
const packageJSON = require('../package.json');
const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const httpProxy = require('http-proxy');
const HttpsProxyAgent = require('https-proxy-agent');
const HttpProxyRules = require('http-proxy-rules');


const port = 80;

// para opções como certificados para usar com https
 // exemplo
 // const options = {
 // key: fs.readFileSync('exemplo-key.pem'),
 // cert: fs.readFileSync('exemplo-cert.pem')
 // }

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

//No caso de HTTPS (usar a LIB de HTTPS e passar os certificados no options)
http
  .createServer(function (req, res) {
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
