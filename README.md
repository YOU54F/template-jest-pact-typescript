# Pact Consumer Example in Typescript with Jest

This repository is driven by compass-dev.

## Installation

- clone repository
- Run `yarn install`
- Run `yarn build`

### Run pact tests

- Run `yarn run pact-test`

### Start the mock server

- Run `docker-compose up`

### Run requests against the mock server

- With Postman, open the `pact-consumer-example-typescript.postman_collection` and run each of the 4 tests
- Or see the following curl commands in the next section
  
#### Example requests

Pact contract test 1 - Happy Path, send a valid request and expect a valid response

```sh
curl -X POST \
  http://localhost:8080/test \
  -H 'Content-Type: application/json' \
  -d '{"last_name":"happyPath"}'
```

Expected and actual response below

```sh
{
    "testResult": "validRequest"
}
```

Pact contract test 2 - Unhappy Path, send an invalid request (empty required field) and expect an error

```sh
curl -X POST \
  http://localhost:8080/test \
  -H 'Content-Type: application/json' \
  -d '{"last_name":""}'

```

Expected and actual response below

```sh
{
    "errors": [
        "An error occurred"
    ]
}
```

Pact Stub Server Test 3 - Dev Functionality Test - An empty post request should return a 404

```sh
curl -X POST \
  http://localhost:8080/test \
  -H 'Content-Type: application/json'

```

Expected Result = Returns an empty response body and a 404
Actual Result = Returns the below body and a 200

```sh
{
    "testResult": "validRequest"
}
```

Pact Stub Server Test 4 - Dev Functionality Test - An post request with a field not specified in the providers request body should return a 404

```sh

curl -X POST \
  http://localhost:8080/test \
  -H 'Content-Type: application/json' \
  -d '{
    "unknownData": "validRequest"
  }'
```

Expected Result = Returns an empty response body and a 404
Actual Result = Returns an empty response body and a 404

## TODO

- Investigate why pact-foundation/pact-stub-server is returning a response from the pact contract, where no body has been provided in the request.