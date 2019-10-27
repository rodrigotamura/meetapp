# What is this application

This is an API from Meetapp app, an event aggregator for developers.

## Which purpose is it made for?

For learning purpose, encouraged by RocketSeat team (visit their [website](https://www.rocketseat.com.br)).

## Which tecnologies we are using here?

The main language is the modern **Javascript**. Running on **NodeJS**, supported with **Express Framework** and using **Yarn** for package management.

I`ve used **Sucrase** (assuming that we are developing on JS for modern browsers, an alternative to Babel) integrated with **Nodemon** (an increadible live reload server).

For code standardize I`ve used **ESLint + Prettier + Editor Config**.

I've used **Sequelize** for database ORM.

For Authentication I've used **JWT** with **jsonwebtoken** package.

For data validation I've used **Yup** and **BCRYPTJS** in order to hash our passwords.

### For Database

PostgreSQL running in a Docker container:
`docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`
