COMPOSE_FILE	=	docker-compose.yml

all:
	docker-compose -f $(COMPOSE_FILE) up --build -d
up:
	docker-compose -f $(COMPOSE_FILE) up -d
down:
	docker-compose -f $(COMPOSE_FILE) down

clean: down

fclean: clean
	docker-compose down --volumes
re:	clean all

.PHONY: up down clean fclean re all
