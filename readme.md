# Etapas para rodar o projeto

## 1. Clonar o repositório
```bash
git clone https://github.com/BrunoVesp/spacezone.git
```

## 2. Criar o arquivo `.env`

Na raiz da pasta `back-end`, crie um arquivo chamado `.env` com o seguinte conteúdo:

```env
PORT="3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spacezone?schema=public"
```

## 3. Configurar o banco de dados

Instale o **pgAdmin** e crie um servidor com os seguintes dados:

* **Nome:** spacezone
* **Hostname:** localhost
* **Port:** 5432
* **User:** postgres
* **Password:** postgres

## 4. Instalar dependências

Dentro da pasta `back-end`, rode:

```bash
npm install
```

## 5. Criar tabelas no banco

Ainda na pasta `back-end`, rode:

```bash
npx prisma db push
```

## 6. Rodar a API

Na pasta `back-end`, inicie o servidor com:

```bash
npm run dev
```

```

Quer que eu já adicione também uma seção de **pré-requisitos** (Node.js, NPM, PostgreSQL e Prisma) no início, pra ficar ainda mais profissional?
```
