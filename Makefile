# Makefile

.PHONY: all client record server

all: client record server

setup:
	cd roadrunner/client && npm install
	pip install -r requirements.txt

client:
	cd roadrunner/client && npm install && npm start

record:
	PYTHONPATH=roadrunner python3 roadrunner/pi/record.py

server:
	PYTHONPATH=roadrunner uvicorn roadrunner.infra.main:app --reload

