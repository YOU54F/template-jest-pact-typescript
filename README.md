# Pact Consumer Workflow Example in Typescript with Jest

[![CircleCI](https://circleci.com/gh/YOU54F/jest-pact-typescript.svg?style=svg)](https://circleci.com/gh/YOU54F/jest-pact-typescript)

## Showcases the following

- [x] Written in Typescript
- [x] Utilises Pact in a Jest Wrapper [jest-pact](https://github.com/YOU54F/jest-pact)
- [x] Uses Swagger to define API
- [x] Uses Swagger-cli to validate Swagger specification
- [x] Uses Pact.io to perform consumer driven contract tests
- [x] Uses Swagger-mock-validator to validate generated pact contracts
- [x] Publishes validated pact contracts to pact-broker (hosted on AWS EC2)
- [x] Pact mock service docker base
- [x] Pact mock service docker base examples
- [x] circleci config
- [x] use pmpact to generate postman collections for pact contracts
- [x] Example pact tests
  - [x] AWS v4 Signed API Gateway Provider
  - [x] Soap API provider
  - [x] File upload API provider
  - [x] JSON API provider
- [x] Pact mock service docker base
- [x] Pact mock service docker base examples
- [x] Postman integration
  - [x] Generate postman collections from pact contracts
  - [x] Inject URL into postman collection from `PACT_PROVIDER_URL`
  - [x] Run postman scripts with newman
  - [x] Run postman scripts with jest
- [ ] example can-i-deploy

## Where can I see it

- CircleCI builds here - <https://circleci.com/gh/YOU54F/pact-consumer-example-typescript>
- Pact Broker here - <https://you54f.co.uk> - running on AWS Lambda (see <https://github.com/YOU54F/pact_broker-serverless> for details of setup)

## Installation

- clone repository
- Run `yarn install`

### Run pact tests

- Run `yarn run pact-test`

### Validate Swagger spec

- Run `yarn run swagger-validate-spec`

### Validate Pact contract against Swagger spec

- Run `yarn run swagger-validate-pact`

### Publish pacts

- Run `yarn run pact-publish`

### Start the mock server

- Run `cd docker && docker-compose up`

### Set the following env vars for pact publishing

- PACT_BROKER_BASE_URL
- PACT_BROKER_TOKEN

### Create postman collections from pacts

- run `./postman/postman-pact.sh` to generate postman collections in `pact/postman/collections`
- run `./postman/postman-replace-urls.sh` to generate env configs for postman in `pact/postman/env` where the urls are replaced with `$PACT_PROVIDER_URL`
- run `./postman/postman-newman.sh` to run the postman collection against your `$PACT_PROVIDER_URL`
- run newman tests with jest, via `npx jest -c jest.newman.js`

Note:- There are no tests in the saved postman collections, so it will run the requests, but will not validate the responses are as per the pacts.

TODO

- [ ] Currently this will use `$PACT_PROVIDER_URL` for all generated postman collections, add the ability to specify a provider name, and update the url accordingly.

## Build your own Pact Stub Service for your pacts in Docker

`cd docker/pact-stub-service`

Build the base pact image, change the name `you54f` to your own dockerhub username

The Base image resides at `base.Dockerfile` which will load the pact ruby standalone, plus a healthcheck endpoint `/healthcheck` on the containers for use in AWS and other Cloud providers.

`make pact_build`
docker build -t pact-base -f base.Dockerfile .
`make pact_tag`
docker tag pact-base you54f/pact-base
`make pact_push`
docker push you54f/pact-base

You can then copy your pact files generated with `yarn run test` into the `docker/pact-stub-service/pacts` folder that the `Dockerfile` will use.

`copy_pacts`
rm -rf pacts && cp -r ../../pact/pacts .

Look at the `Dockerfile`

```Dockerfile
FROM you54f/pact-base

ARG PACT_FILE

COPY ${PACT_FILE} /pact.json
```

See the `docker/docker-compose.yml` file for how to load your pacts into the docker container.

```yaml
version: "3.1"

services:
  pact-stub-server-json:
    build:
      context: pact-stub-service
      args:
        PACT_FILE: pacts/test-consumer-json-provider.json
    ports:
      - "8080:8080"
```

You can run it with `cd docker && docker-compose up`

## Credits

- [Pact Foundation](https://github.com/pact-foundation)
- [Pact JS](https://github.com/pact-foundation/pact-js)
