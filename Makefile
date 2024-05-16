# Makefile

.PHONY: all client record server blog setup

all: client record server blog

setup:
	cd roadrunner/client && npm install
	pip install -r requirements.txt
	cd roadrunner/blog && yarn install

client:
	cd roadrunner/client && npm install && npm start

record:
	PYTHONPATH=roadrunner python3 roadrunner/pi/record.py

server:
	PYTHONPATH=roadrunner uvicorn roadrunner.infra.main:app --reload

blog:
	yarn --cwd blog dev
