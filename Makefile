killport:
	npx kill-port --port $(port)
dockeru:
	docker-compose -f docker-compose-apple-silicon.dev.yml up -d	
dockerd:
	docker-compose -f docker-compose-apple-silicon.dev.yml down
