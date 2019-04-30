FROM ruby:2-alpine

RUN apk add --no-cache --virtual build-dependencies build-base
RUN gem install pact-mock_service

ARG PACT_FILE
ARG PORT

COPY pacts/${PACT_FILE} /app/pact.json

WORKDIR /app

CMD exec pact-stub-service pact.json --port 8080 --host 0.0.0.0

