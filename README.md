# Sobre

Este monorepo trata-se da entrega do DESAFIO FINAL para a **Certificação GoStack 8**.

Este sistema foi baseado nos requisitos proposto pela RocketSeat. [Veja aqui mais detalhes](./desafio_final).

## Instruções para poder rodá-lo

Após a clonagem deste repositório, criar o arquivo de ambiente `/backend/.env` baseado no arquivo `/backend/.env.example`, e atribuir os valores de conexão com o banco de dados PostgreSQL, Redis, e-mail, URL e a porta da aplicação.

### Subindo servidor Redis

`docker run --name redisbarber -p 6379:6379 -d -t redis:alpine`

### Subindo servidor Postgres

`docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

## Algumas observações

A versão mobile da aplicação foi desenvolvida e testada na versão para Android.
