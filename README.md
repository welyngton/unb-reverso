# unb-reverso

O objetivo deste aplicativo é fornecer um mecanismo de proxy reverso para ser utilizado durante o desenvolvimento e testes de aplicativos

> **Observação**: Caso a execução com `npx` esteja lenta devido a problemas de rede, é possível fazer a instalação local do `unb-reverso` com o comando `npm install -g unb-reverso` em seguida, troque o comando `npx unb-reverso` por `unb-reverso` nas instruções abaixo. A desvantagem é que, para receber atualizações do `unb-reverso`, você terá que instalá-lo novamente.

## Instruções

Para utilizar este proxy, primeiro execute com a opção `--init` para criar um arquivo de configuração inicial:

```bash
> npx unb-reverso --init
```

Será criado um arquivo de configuração de exemplo com o nome `unb-reverso-conf.json` na mesma pasta com seguinte formato:

```json
{
  "version": 1,
  "folhast.fabrica.local": {
    "rules": {
      ".*/<minha-api>/": "http://localhost:4200/",
    },
    "default": "http://folhaqa.fabrica.local"
  },
  "consig.st.fabrica.local": {
    "rules": {
      ".*/<minha-api>/": "consig.qa.fabrica.local/minha-api"
    },
    "default": "consig.qa.fabrica.local"
  }
}
```

Em seguida o desenvolvedor deve ajustar este arquivo para os dados da aplicação que está trabalhando, por exemplo:

```json
{
  "version": 1,
  "folhast.fabrica.local": {
    "rules": {
      ".*/rubrica/": "http://localhost:4000/",
    },
    "default": "http://folhaqa.fabrica.local"
  },
  "consig.st.fabrica.local": {
    "rules": {
      ".*/api/consignacoes/": "consig.qa.fabrica.local/api/consignacoes/"
    },
    "default": "consig.qa.fabrica.local"
  }
}
```

> Para mais formatos de regras consulte o projeto <https://github.com/donasaur/http-proxy-rules>

```bash
> npx unb-reverso
```

Para omitir os logs de redirecionamento, adicione a opção `--silent` ao `unb-reverso`:

```bash
> npx unb-reverso --silent
```