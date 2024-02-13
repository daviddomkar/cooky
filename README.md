# **🧁 WELCOME TO COOKY! 🧁**

<img src="https://64.media.tumblr.com/2894bb3d2325eb0de3e6a8fbe07c2c59/ab4f8d5953fb26f5-79/s1280x1920/9074ac143c015498cd0f9d3206fb2194dfc543e6.png" width="320" align="right" >

[Look at the Nuxt 3 documentation to learn more ⬅️](https://nuxt.com/docs/getting-started/introduction)

### 🥐 **What is Cooky?**

<p>Cooky is your interactive culinary hub where you can store personal recipes, discover new favorites, and engage with a community of food enthusiasts. Browse, rate, and save a variety of dishes shared by users around the world. 'Cooky' transforms everyday cooking into a shared journey of culinary discovery and enjoyment.</p>

### **🎓 Why cookbook?**

<p>Cooky, a cookbook, is a school project designed for a university course focused on databases. The goal of the project is to create a comprehensive database application that serves as a collection of recipes. The application should allow users to add their own recipes, rate existing ones, and search for recipes based on various criteria, such as ingredients or name. The project not only provides practical experience with the design and implementation of database systems but also supports understanding the importance of user-friendliness and search efficiency in databases. Cooky is therefore not just a school project but also a useful tool for anyone looking for culinary inspiration.</p>

### **💻 Technologies**

[![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=Docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![Nuxt](https://img.shields.io/badge/-Nuxt-00DC82?style=flat&logo=Nuxt.js&logoColor=white)](https://nuxtjs.org/)
[![Vue](https://img.shields.io/badge/-Vue-4FC08D?style=flat&logo=Vue.js&logoColor=white)](https://vuejs.org/)
[![Typescript](https://img.shields.io/badge/-Typescript-3178C6?style=flat&logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![unocss](https://img.shields.io/badge/-unocss-FF6B81?style=flat&logo=unocss&logoColor=white)](https://github.com/unocss/unocss)
[![prettier](https://img.shields.io/badge/-prettier-F7B93E?style=flat&logo=Prettier&logoColor=black)](https://prettier.io/)
[![eslint](https://img.shields.io/badge/-eslint-4B32C3?style=flat&logo=ESLint&logoColor=white)](https://eslint.org/)
[![husky](https://img.shields.io/badge/-husky-A142F4?style=flat&logo=Husky&logoColor=white)](https://typicode.github.io/husky/#/)
[![commitlint](https://img.shields.io/badge/-commitlint-207DE5?style=flat&logo=Commitlint&logoColor=white)](https://commitlint.js.org/)
[![stylelint](https://img.shields.io/badge/-stylelint-263238?style=flat&logo=stylelint&logoColor=white)](https://stylelint.io/)

### Requirements

- [Node LTS (20.11.0)](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop/)

### Setup

- Install all dependencies:

  ```bash
  npm install
  ```

- Install all recommended VS Code extensions for the best development experience. VS Code will prompt you to install them when you open the project.

### Development Server

The easiest way to run the project is to use the provided Docker Compose configuration. This will build production application server and a PostgreSQL database.

```bash
docker compose up
```

The database schema will be created with some initial data, application will be available at `http://localhost:8080`.

This setup is just for testing purposes, to preview the finished product and not inteded for development.

The database will be persisted in a `cooky` docker volume. To remove the database and start from scratch, you can use the following commands:

```bash
docker compose down -v
docker compose up
```

## Development

For development, you can use the development server provided by Nuxt. This will enable hot reload and debugging functionality.

To start the development server, you can use the following command:

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```
