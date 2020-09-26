# RDLSC - Frontend WEB

Frontend WEB do Projeto "RDLSC"

Projeto React JS com TypeScript, ESLint e Prettier.


## Create React App with Typescript

* npm i -g create-react-app
* create-react-app 05-primeiro-projeto-react --template=typescript

## Development flow

* Criar estrutura de pastas
```bash
rdlsc-web
  - src
    - assets
    - components
    - hooks
      - auth
      - toast
    - pages
      - NamePage
        - index.tsx
        - styles.tsx
    - routes
    - services
    - styles (global)
    - utils
```
* Desenvolver os modulos
  * criar estrutura de pastas e arquivos para cada modulo (src/pages/NamePage)
  * atualizar rotas em src/routes


### Dicas/Lembretes

* //eslint-disable-line
  desabilita a checagem do eslint na linha

* Ferramentas on-line
  - https://whimsical.com/
    - The Visual Workspace - Communicate visually at the speed of thought.
      * Flowcharts / Wireframes / Sticky Notes / Mind Maps

* Run cache cleaned
  * $ yarn start --reset-cache

## Deploy Frontend on Netlify

* criar .env
* adicionar no  .gitignore
* atualizar no github
* deploy no netlify
  * criar conta
  * acessar git
  * configurar variavel (REACT_APP_API_URL)
  * ajustar DNS
    * settings >> domain managments >> add custom domain
    * adicionar na zona DNS "gobarber CNAME zealous-lalande-b182ad.netlify.app."
  * ativar SSL

* deploy Google Cloud

### Deploy on CPanel server (js static)

* step 1:"homepage": ".", -->add this on package.json file
* step 2 : npm run build --> this will create a build folder.
* step 3 : make a .htaccess it will look like this

```
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
</IfModule>
```

### Deploy Frontend at node server

* Instalar node

* clonar repositorio do git dentro do servidor
  * $ cd app
  * $ git clone https://github.com/leocairos/frontend-rdlsc.git
* gerar build
  * $ cd frontend-rdlsc
  * $ yarn
  * $ yarn build

* ajustar .env
  * $ cp .env.example .env
  * $ vim .env

* Testar build
  * $ node index.js

* Mantendo aplicação no ar

  * instalar pm2: $ sudo npm install -g pm2
  * executar frontend com PM2
    * $ pm2 start index.js --name frontend-rdlsc

    *  pm2 start pm2-config.json
    *  pm2 delete pm2-config.json

    * comandos pm2
      * pm2 list
      * pm2 monit
      * pm2 log NAMEAPP
      * pm2 stop NAMEAPP
      * pm2 delete NAMEAPP

  * automatizar start do PM2:
    * $ pm2 startup systemd
    * $ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/leonardo.sampaio


## Git Flow
  * usar develop sempre

  * git add .
  * git commit -m "comment implementation"
  * git push origin *branch*
