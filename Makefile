.PHONY: start

start:
	docker-compose -f docker-compose.dev.yml up -d
	tmux start-server \; source-file .tmux.conf
	docker-compose -f docker-compose.dev.yml down
