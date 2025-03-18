# Torrestir Orders

Este projeto implementa a gestão de encomendas para o sistema **Torrestir Orders** utilizando as tecnologias **Express**, **Knex**, **Swagger** e **MySQL**.

## Tecnologias

- **Express**: Framework web para Node.js.
- **Knex**: Query Builder para MySQL.
- **Swagger**: Ferramenta para documentação da API.
- **MySQL**: Sistema de gestão de bases de dados.

## Instalação

### 1. Clonar o Repositório

Clone este repositório para a sua máquina local:

```bash
git clone https://github.com/carlosaedo/torrestir-back-end.git
cd torrestir-back-end
```

### 2. Instalar dependências

NodeJs > https://nodejs.org/en/download

Finalizando a instalação:

```bash
npm install --global yarn
yarn install
```

### 4. Base de Dados

Criar base de dados MySql com o nome **torrestir_orders**

Configurar o **user** e **password** no ficheiro **knexfile.js** em **development** e **test**

Usar o DUMP que se encontra na pasta **EXTRAS**

Ou executar as migrações knex e seeds com os seguintes comandos:

```bash
npx knex migrate:latest
```

seguido de

```bash
npx knex seed:run
```

### 5. Executar testes

```bash
yarn test
```

### 6. Iniciar servidor

```bash
yarn start
```

### 7. Aceder à documentação através do swagger

http://localhost:3000/api-docs/

### 8. Utilizador de testes

email: carlosalexandreaedo@gmail.com
password: 123456

### Explicação:

- **Instalação e Configuração**: Instruções claras sobre como clonar o repositório e instalar as dependências.
- **Swagger**: Explicação sobre como aceder a documentação da API após iniciar o servidor.
- **Testes**: Como executar os testes utilizando **Jest**.
- **Extras**: Detalha o conteúdo na pasta **EXTRAS** (dump MySQL e coleção do Postman).
