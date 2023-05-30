# ft_transcendence

## Description

Final project of the 42 cursus.

Ft_transcendence is a website where you can play online pong and chat with other users.
The site also lets you add users as friends, and enable/disable 2fa.

## Stack

-   **Frontend**: React, Redux, tailwindcss, Typescript

-   **Backend**: NestJS, Postgres

-   **Environment**: Docker, Docker-compose

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%2320232a.svg?style=for-the-badge&logo=redux&logoColor=%2361DAFB)
![Tailwindcss](https://img.shields.io/badge/tailwindcss-%2320232a.svg?style=for-the-badge&logo=tailwindcss&logoColor=%2361DAFB)
![Typescript](https://img.shields.io/badge/typescript-%2320232a.svg?style=for-the-badge&logo=typescript&logoColor=%2361DAFB)
![NestJS](https://img.shields.io/badge/nestjs-%2320232a.svg?style=for-the-badge&logo=nestjs&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%2320232a.svg?style=for-the-badge&logo=postgres&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%2320232a.svg?style=for-the-badge&logo=docker&logoColor=%2361DAFB)
![Docker-compose](https://img.shields.io/badge/docker--compose-%2320232a.svg?style=for-the-badge&logo=docker&logoColor=%2361DAFB)

## Usage

First, you need to install docker and docker-compose.

You need to create a .env file at the root of the project and also in ./packages/backend. The .env file need to follow the .env.example file.

Then, you can run the makefile according to your needs:

```
make # or make prod, it's the same
make dev # to start the server in dev mode

make front # to start only the frontend container
make back # to start only the backend and the db containers

make clean # down the containers
make fclean # down the containers and remove the volumes

make clean-dev # remove the node_modules folder locally

make clean-docker # remove all the docker images and containers

make mclean # fclean + clean-dev + clean-docker
```

## Authors

-   Arnaud Guillard - [![GitHub](https://i.stack.imgur.com/tskMh.png) GitHub](https://github.com/arnaud35300)
-   Sylvio Poliard - [![GitHub](https://i.stack.imgur.com/tskMh.png) GitHub](https://github.com/Sylsee)
-   Riyaz Usmanov - [![GitHub](https://i.stack.imgur.com/tskMh.png) GitHub](https://github.com/riazus)

## Contributing

If you see any error, or if you have any suggestion, please contact us or open an issue.

## License

[MIT](https://choosealicense.com/licenses/mit/)
