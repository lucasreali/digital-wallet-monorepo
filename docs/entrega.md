# 📦 Projeto PJBL — Arquitetura Completa

## 📑 Sumário

1. [Objetivo](#-objetivo)
2. [Arquitetura da Solução](#-arquitetura-da-solução)
3. [Fluxo da Aplicação](#-fluxo-da-aplicação)
4. [Dockerização](#-dockerização)
5. [Requisitos de Código](#-requisitos-de-código)
6. [Repositórios (GitHub)](#-repositórios-github)
7. [README.md de cada projeto](#-readmemd-de-cada-projeto)
8. [Documentação (PDF da Entrega 3)](#-documentação-pdf-da-entrega-3)
9. [Vídeo (YouTube)](#-vídeo-youtube)
10. [Checklist Final](#-checklist-final)

---

## 🎯 Objetivo

Desenvolver e demonstrar uma aplicação distribuída utilizando **microservices**, **BFF**, **microfrontend** e **Azure Functions**, aplicando padrões modernos:

- Clean Architecture
- Vertical Slice
- Event-Driven Architecture
- API Gateway + BFF + Microservice + Database Service + Serverless
- Integração com múltiplos bancos de dados

---

## 🧱 Arquitetura da Solução

| # | Componente | Tecnologia | Responsabilidade |
|---|------------|------------|------------------|
| 1 | Microfrontend | React ou Angular (SPA) | Interface do usuário; consome **apenas** o BFF |
| 2 | BFF | Node.js (Express ou NestJS) | Agregação de dados, proxy CRUD, comunicação com microservices e Function |
| 3 | Microserviço 1 | MongoDB Atlas (Free Tier) | Domínio próprio (ex: Produtos) — CRUD + Swagger |
| 4 | Microserviço 2 | Azure SQL Database (Free 1 DTU) | Domínio próprio (ex: Pedidos) — CRUD + Swagger |
| 5 | Azure Function | HTTP Trigger / Message Trigger | Cálculo ou enriquecimento de dados, exposta via HTTP |
| 6 | API Gateway | AWS API Gateway | Roteamento, segurança e centralização de entrada |

### 🔹 1. Microfrontend

- Interface do usuário (SPA)
- Tecnologia: React ou Angular
- Consome **somente o BFF** (não acessa microservices diretamente)

### 🔹 2. BFF (Backend for Frontend) — Node.js

- Implementado preferencialmente com Node.js (Express ou NestJS)
- Responsabilidades:
  - Agregação de dados
  - Proxy de requisições (CRUD)
  - Comunicação com microservices e com a Function (HTTP Trigger)

> 📌 **Endpoint obrigatório:** `GET /aggregated-data`
>
> - Consome Microserviço 1, Microserviço 2 e Azure Function
> - Retorna tudo em **um único response**

### 🔹 3. Microserviço 1 (MongoDB)

- Banco: MongoDB Atlas (Free Tier)
- Domínio: ex. Produtos
- CRUD completo
- Swagger documentado

### 🔹 4. Microserviço 2 (Azure SQL)

- Banco: Azure SQL Database (Free 1 DTU)
- Domínio: ex. Pedidos
- CRUD completo
- Swagger documentado

### 🔹 5. Azure Function

- Tipo: HTTP Trigger / Message Trigger
- Pode simular cálculo ou enriquecimento de dados
- Exposta via endpoint HTTP

### 🔹 6. API Gateway (opcional, mas exigido na entrega)

- Ferramenta: AWS API Gateway
- Responsável por roteamento, segurança e centralização de entrada

---

## 🔄 Fluxo da Aplicação

~~~
Usuário ──► Microfrontend ──► API Gateway ──► BFF
                                               ├──► Microserviço Mongo
                                               ├──► Microserviço SQL
                                               └──► Azure Function
                                               ▼
                                        JSON único agregado
~~~

1. Usuário acessa o Microfrontend
2. Front chama o BFF
3. BFF consulta o Microserviço Mongo, o Microserviço SQL e a Azure Function
4. BFF agrega tudo
5. Retorna um único JSON

---

## 🐳 Dockerização

Publicar no **Docker Hub** cada serviço (microservices + BFF):

~~~bash
docker build -t <registry>/<repo>/<imagem>:<tag> .
docker login <registry>
docker push <registry>/<repo>/<imagem>:<tag>
~~~

**Exemplo:**

~~~bash
docker build -t dockerhubuser/pjbl/bff:v1 .
docker push dockerhubuser/pjbl/bff:v1
~~~

---

## 🧪 Requisitos de Código

### ✔ Clean Architecture

Separação em camadas:

- `Domain`
- `Application`
- `Infrastructure`
- `API`

### ✔ Vertical Slice

Organização por feature (ex: `CreateOrder`, `GetOrder`)

### ✔ Testes

- Testes unitários
- Testes de arquitetura

---

## 📂 Repositórios (GitHub)

Publicar **tudo** em repositórios **públicos**:

| Projeto | Link |
|---------|------|
| Microfrontend | _a preencher_ |
| BFF | _a preencher_ |
| Microserviço Mongo | _a preencher_ |
| Microserviço SQL | _a preencher_ |
| Azure Function | _a preencher_ |

---

## 📄 README.md de cada projeto

Cada repositório deve conter:

- Descrição da arquitetura
- Tecnologias utilizadas
- Como rodar localmente
- Nome dos alunos

> ⚠️ A apresentação em vídeo deve demonstrar **URLs da internet/cloud**, não `localhost`.

---

## 🧾 Documentação (PDF da Entrega 3)

### 📘 ARC42 — Links obrigatórios

| Item | Link |
|------|------|
| GitHub (todos os projetos) | _a preencher_ |
| Docker Hub (imagens) | _a preencher_ |
| Swagger — BFF | _a preencher_ |
| Swagger — Microservices | _a preencher_ |
| Swagger — Eventos | _a preencher_ |
| Frontend | _a preencher_ |
| API Gateway | _a preencher_ |
| Vídeo no YouTube | _a preencher_ |

### 🧩 Outros artefatos obrigatórios

- **C4 Model atualizado:** Contexto, Containers e Componentes
- **Canvas**
- **Prints:**
  - Swagger BFF
  - Swagger Microservices
  - Frontend funcionando
  - API Gateway

---

## 🎥 Vídeo (YouTube)

- Plataforma: YouTube
- Visibilidade: **Não listado** (somente link)
- **Todos do grupo devem falar**, deixando isso explícito no vídeo
- Deve usar **URLs da internet/cloud**, não `localhost`

### O vídeo deve demonstrar

- Frontend funcionando
- Chamadas passando pelo BFF
- CRUD / Regra de negócio completo
- Integração com MongoDB, SQL Server, Function e Eventos
- Fluxo completo da arquitetura

---

## ✅ Checklist Final

### Código
- [ ] Microfrontend (React/Angular) consumindo apenas o BFF
- [ ] BFF com `GET /aggregated-data`
- [ ] Microserviço Mongo com CRUD + Swagger
- [ ] Microserviço SQL com CRUD + Swagger
- [ ] Azure Function exposta via HTTP
- [ ] API Gateway configurado
- [ ] Clean Architecture (Domain / Application / Infrastructure / API)
- [ ] Vertical Slice por feature
- [ ] Testes unitários
- [ ] Testes de arquitetura

### Publicação
- [ ] Imagens publicadas no Docker Hub
- [ ] Repositórios públicos no GitHub
- [ ] README.md completo em cada projeto

### Documentação (PDF)
- [ ] ARC42 com todos os links
- [ ] C4 Model (Contexto, Containers, Componentes)
- [ ] Canvas
- [ ] Prints (Swagger BFF, Swagger Microservices, Frontend, API Gateway)

### Vídeo
- [ ] Publicado como não listado
- [ ] Todos os integrantes falam
- [ ] Demonstra URLs em cloud (sem localhost)
- [ ] Mostra o fluxo completo da arquitetura

---

## 👥 Integrantes

| Nome | RA / Matrícula |
|------|----------------|
| _a preencher_ | _a preencher_ |
