COMPOSE_FILE	=	docker-compose.yml
DOCKER			=	docker compose # docker-compose
OPTIONS			=	#-d

_RESET			=	\e[0m
_RED			=	\e[31m
_GREEN			=	\e[32m
_YELLOW			=	\e[33m
_CYAN			=	\e[36m


all:
	$(DOCKER) -f $(COMPOSE_FILE) up --build $(OPTIONS)

help: SHELL:=/bin/bash
help:	
	@printf "%s\n" 		"Usage: make [target]"
	@printf "%b\n" 		"- $(_YELLOW)Targets:$(_RESET)"
	@printf "\t%b\n" 	"- [$(_CYAN)all$(_RESET)]		Builds, (re)creates, starts, and attaches to containers for a service, and build images before starting containers."
	@printf "\t%b\n" 	"- $(_CYAN)up$(_RESET)		Same as all without building images."
	@printf "\t%b\n" 	"- $(_CYAN)down$(_RESET)		Stop and remove the containers"
	@printf "\t%b\n" 	"- $(_CYAN)clean$(_RESET)		Same as down"
	@printf "\t%b\n" 	"- $(_CYAN)fclean$(_RESET)	Call clean and remove images and volumes"
	@printf "\t%b\n" 	"- $(_CYAN)re$(_RESET)		Equivelant to down and up."
	@printf "\t%b\n" 	"- $(_CYAN)help$(_RESET)		Show this help"
	@printf "%b\n" 		"- $(_YELLOW)Notes:$(_RESET)"
	@printf "\t%b\n" 	"- You can use $(_GREEN)docker compose$(_RESET) instead of $(_GREEN)docker-compose$(_RESET) if you have installed the docker-compose v2."
	@printf "\t%b\n" 	"- The containers are started in the background. Remove -d option to run in foreground."
	@printf "\t%b\n" 	"- Don't hesitate to use $(_GREEN)docker system prune$(_RESET) commands to clean your environment."
	@printf "\t%b\n"	"  See $(_CYAN)https://docs.docker.com/engine/reference/commandline/system_prune/$(_RESET)"
	@printf "\t%b\n" 	"- Be careful, the $(_GREEN)fclean$(_RESET) target will remove all the containers and images."
	@printf "\t%b\n" 	"- You can use the $(_GREEN)COMPOSE_FILE$(_RESET) variable to specify the docker-compose file to use."
	@printf "\t%b\n" 	"- You can use the $(_GREEN)DOCKER$(_RESET) variable to specify the docker-compose command to use."
	@printf "\t%b\n" 	"- You can use the $(_GREEN)OPTIONS$(_RESET) variable to specify the docker-compose options to use."

up:
	$(DOCKER) -f $(COMPOSE_FILE) up $(OPTIONS)

down:
	$(DOCKER) -f $(COMPOSE_FILE) down

clean: down

fclean: clean
	$(DOCKER) -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans

dev:
	npm install
	npm install ./packages/backend

clean-dev:
	rm -rf ./packages/backend/node_modules ./packages/backend/dist ./node_modules

re:	clean all

.PHONY: up down clean fclean re all

