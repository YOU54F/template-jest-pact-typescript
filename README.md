# _note_ this repostory has now been integrated into [jest-pact](https://github.com/YOU54F/jest-pact) and has now been archived

# Pact Consumer Example in Typescript with Jest

## Showcases the following

- Written in Typescript
- Utilises Jest Test Runner
- Uses Swagger to define API
- Uses Swagger-cli to validate Swagger specification
- Uses Pact.io to perform consumer driven contract tests
- Uses Swagger-mock-validator to validate generated pact contracts
- Publishes validated pact contracts to pact-broker (hosted on AWS EC2)
- Tags validated contracts with branch name

## Where can I see it

- CircleCI builds here - <https://circleci.com/gh/YOU54F/pact-consumer-example-typescript>
- Pact Broker here - <https://you54f.co.uk> - running on AWS Lambda (see https://github.com/YOU54F/pact_broker-serverless for details of setup)

## Installation

- clone repository
- Run `yarn install`
- Run `yarn build`

### Run pact tests

- Run `yarn run pact-test`
  
### Validate Swagger spec

- Run `yarn run swagger-validate-spec`
  
### Validate Pact contract against Swagger spec

- Run `yarn run swagger-validate-pact`
  
### Publish pacts

- Run `pact-publish`
  
### Tag pacts

- Run `pact-tag`

### Start the mock server

- Run `docker-compose up`

### Set the following env vars for pact publishing

- PACT_BROKER_URL
- PACT_BROKER_BASIC_AUTH_USERNAME
- PACT_BROKER_BASIC_AUTH_PASSWORD

## Credits

- [Pact Foundation](https://github.com/pact-foundation)
- [Pact JS](https://github.com/pact-foundation/pact-js)
- [Initial Proposal](https://github.com/pact-foundation/pact-js/issues/215#issuecomment-437237669) by [TimothyJones](https://github.com/TimothyJones)
