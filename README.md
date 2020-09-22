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

## Deploy Frontend

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

## Git Flow
  * usar develop sempre
