#!make

include .env
export $(shell sed 's/=.*//' .env)

.PHONY: run stop build login deploy compose test env

default: build

env: 
		printenv

run:
		docker-compose up ${SERVICE}

stop:
		docker stop ${SERVICE}

build:		
		docker build -t registry.git.avidi.tech/${GROUP}/${SERVICE} .

login: 
		echo 'e4131f43-757a-460c-a4a1-f05eb8a62450' | docker login --username taftanashchuk --password-stdin

deploy:
		docker push registry.git.avidi.tech/${GROUP}/${SERVICE}

compose:
		docker-compose up -d

test: compose
		npm run test
