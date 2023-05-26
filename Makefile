COMPOSE_FILE	=	docker-compose.dev.yml
DOCKER			=	docker compose # docker-compose
OPTIONS			=	#-d

_RESET			=	\e[0m
_RED			=	\e[31m
_GREEN			=	\e[32m
_YELLOW			=	\e[33m
_CYAN			=	\e[36m

all:
	$(DOCKER) -f $(COMPOSE_FILE) up --build $(OPTIONS)

front:
	$(DOCKER) -f $(COMPOSE_FILE) up --build $(OPTIONS) frontend

back:
	$(DOCKER) -f $(COMPOSE_FILE) up --build $(OPTIONS) backend db

clean:
	$(DOCKER) -f $(COMPOSE_FILE) down

fclean: clean
	$(DOCKER) -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans

clean-dev:
	rm -rf ./packages/backend/node_modules ./packages/backend/dist ./packages/backend/coverage
	rm -rf ./packages/frontend/node_modules ./packages/frontend/dist ./packages/frontend/coverage
	rm -rf ./node_modules

clean-docker:
	docker system prune
	docker volume prune

mclean: fclean clean-dev clean-docker

r: fclean clean-dev clean-docker all

re: fclean all

.PHONY: all front back clean fclean clean-dev clean-docker mclean r re
