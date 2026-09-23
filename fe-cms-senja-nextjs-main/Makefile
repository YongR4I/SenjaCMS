.PHONY: deploy build up down logs ps prune

deploy: build up prune

build:
	docker compose build --no-cache

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

prune:
	docker system prune -f
