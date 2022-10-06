COMPOSE_FILE = docker-compose.yml

all:
    sudo mkdir -p ./data/postgres/
    docker-compose -f $(COMPOSE_FILE) up --build

up:
    docker-compose -f $(COMPOSE_FILE) up -d

down:
    docker-compose -f $(COMPOSE_FILE) down

clean: down

    -docker rmi -f postgres

fclean: clean
        sudo rm -rf ./data/postgres/

re: clean all

.PHONY: up down clean fclean re all


#docker compose up --build --force-recreate --no-deps -d