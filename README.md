<h1 align="center">
    <a href="#" alt="API users crud"> API users CRUD </a>
</h1>

<h3 align="center">
API desenvolvida em Typescript, Node.js e Express, integrada ao banco de dados MongoDB.
</h3>

Tabela de conteúdos
=================
<!--ts-->
   * [Sobre o projeto](#sobre-o-projeto)
   * [Conceitos utilizados](#conceitos-utilizados)
   * [Funcionalidades](#funcionalidades)
   * [Tecnologias utilizadas](#tecnologias-utilizadas)
   * [Entidades](#entidades)
   * [Rotas](#rotas)
<!--te-->


## Sobre o projeto

Este é um projeto de estudos de uma API com as operações de CRUD (Create, Read, Update e Delete) de usuários.

---

## Conceitos utilizados

- SOLID
- Injeção de Dependência (Dependency Injection)
- Repository Pattern

---

## Funcionalidades

A API Cubos Bank oferece as seguintes funcionalidades:

- Registro de Usuário (Create)
- Listagem de todos os Usuários (Read)
- Atualização de dados do Usuário pelo ID (Update)
- Exclusão de Usuário pelo ID (Delete)

---

## Tecnologias utilizadas

As seguintes ferramentas foram usadas na construção do projeto:

-   **[TypeScript](https://www.typescriptlang.org/)**
-   **[Node Js](https://nodejs.org/en)**
-   **[Express](https://expressjs.com/)**
-   **[MongoDB](https://www.mongodb.com/pt-br)**

## Entidades

<pre>
User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}</pre>

## Rotas

- GET /users - retorna os usuários salvos no banco
- POST /users - cria um usuário
- PATCH /users/:id - atualiza um usuário
- DELETE /users/:id - deleta um usuário

## Link do Deploy: https://bored-ox-fedora.cyclic.app
