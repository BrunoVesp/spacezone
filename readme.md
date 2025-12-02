# SpaceZone - Portal de Notícias sobre Astronomia

SpaceZone é um portal de notícias dedicado à astronomia, onde redatores podem publicar posts sobre o universo e usuários podem interagir através de comentários. O projeto foi desenvolvido para facilitar o compartilhamento de informações, curiosidades e descobertas astronômicas, promovendo a troca de conhecimento entre entusiastas e especialistas.

## Requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [PostgreSQL](https://www.postgresql.org/) (versão 13 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
- (Opcional) [pgAdmin](https://www.pgadmin.org/) para gerenciar o banco de dados

## 1. Clonar o repositório

```bash
git clone https://github.com/BrunoVesp/spacezone.git
```

## 2. Configurar o banco de dados

Instale o **PostgreSQL** e crie um banco chamado `spacezone`. Você pode usar o **pgAdmin** para facilitar a administração.

## 3. Instalar dependências do back-end

Dentro da pasta `back-end`, rode:

```bash
npm install
```

## 4. Criar tabelas no banco

Ainda na pasta `back-end`, rode:

```bash
npx prisma db push
```

```bash
npx prisma generate
```

## 5. Rodar a API

Na pasta `back-end`, inicie o servidor com:

```bash
npm run dev
```

---

## 6. Rodar o Front-end

Para iniciar o front-end, acesse a pasta `front-end` e rode os seguintes comandos:

```bash
npm install
npm run dev
```

O front-end será iniciado em ambiente de desenvolvimento e poderá ser acessado pelo navegador no endereço indicado pelo terminal (geralmente `http://localhost:5173` ou similar).
```