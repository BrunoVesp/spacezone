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
- Arquivo .env atualizado:

```env
PORT="3000"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/spacezone?schema=public"
JWT_SECRET_TOKEN="cbcd1d9c63015f3317eebf577fdcecfcfbfddc65aae62735e99f36eba3a7942a"
```

Caso seja necessário mudar o JWT_SECRET_TOKEN basta fazer o seguinte comando:
```
Caso seja necessário mudar o JWT_SECRET_TOKEN basta fazer o seguinte comando:
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
