# unb-reverso

O objetivo deste aplicativo é fornecer um mecanismo de proxy reverso para ser utilizado durante o desenvolvimento e testes de aplicativos.
Por meio desse aplicativo é possível rodar uma aplicação com DNS de servidor localmente, evitando erros de CORS no navegador
## Instruções

Para utilizar este proxy, primeiro execute com a opção `--init` para criar um arquivo de configuração inicial:

```bash
> npx unb-reverso --init
```

Será criado um arquivo de configuração de exemplo com o nome `unb-reverso-conf.json` na mesma pasta com seguinte formato:

```json
{
  "version": 1,
  "dominio.qa.fabrica.local": {
    "rules": {
      ".*/<minha-api>/": "http://localhost:80/api/",
      ".*/<meu-front>/pagina": "http://localhost:4200/pagina",
    },
    "default": "http://dominio.qa.fabrica.local"
  },
  "dominio2.qa.fabrica.local": {
    "rules": {
      ".*/<minha-api>/": "http://localhost:80"
    },
    "default": "http://localhost.st.fabrica.local"
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

### Configurações adicionais

Adicionar no arquivo HOSTS, o domínio que se deseja rodar como LOCALHOST

Por exemplo para rodar o domínio 'dominio.qa.fabrica.local' localmente conforme o arquivo de configuração de exemplo 'unb-reverso-conf.json'

Deve-se incluir este arquivo no HOSTs do sistema operacional adicionando a linha abaixo no arquivo 'Hosts':
```
127.0.0.1  dominio.qa.fabrica.local
```

* No Windows
```
C:\Windows\System32\drivers\etc
```

* No Mac
```
/private/etc/hosts
```

* No Linux
```
/etc/hosts
```

### Desativando check host para o Angular
Caso ocorra erro de 'invalid check host' deve-se subir a aplicação com o seguinte comando
```
ng s --host 127.0.0.1 --port 4200 --disable-host-check
```