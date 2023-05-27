PROD_COMPOSE_FILE	=	docker-compose.prod.yml
DEV_COMPOSE_FILE	=	docker-compose.dev.yml

DOCKER		=	docker-compose
OPTIONS		=	#-d

_RESET		=	\e[0m
_RED			=	\e[31m
_GREEN		=	\e[32m
_YELLOW		=	\e[33m
_CYAN			=	\e[36m

all: prod

dev:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) up --build $(OPTIONS)

prod:
	$(DOCKER) -f $(PROD_COMPOSE_FILE) up --build $(OPTIONS)

front:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) up --build $(OPTIONS) frontend
	$(DOCKER) -f $(PROD_COMPOSE_FILE) up --build $(OPTIONS) frontend

back:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) up --build $(OPTIONS) backend db
	$(DOCKER) -f $(PROD_COMPOSE_FILE) up --build $(OPTIONS) backend db

clean:
	$(DOCKER) -f $(DEV_COMPOSE_FILE) down
	$(DOCKER) -f $(PROD_COMPOSE_FILE) down

fclean: clean
	$(DOCKER) -f $(DEV_COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	$(DOCKER) -f $(PROD_COMPOSE_FILE) down --rmi all --volumes --remove-orphans

clean-dev:
	rm -rf ./packages/backend/node_modules ./packages/backend/dist ./packages/backend/coverage
	rm -rf ./packages/frontend/node_modules ./packages/frontend/dist ./packages/frontend/coverage
	rm -rf ./node_modules

clean-docker:
	docker system prune
	docker volume prune

mclean: fclean clean-dev clean-docker

.PHONY: dev prod front back clean fclean clean-dev clean-docker mclean
