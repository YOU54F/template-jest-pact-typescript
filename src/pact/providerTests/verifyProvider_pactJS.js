'use strict'

// This is the mock provider, it is not required if 
// your own provider or mock is hosted elsewhere
// require('./testDecisionService')

require('dotenv').config() // load dotenv in order read the .env file
const {Verifier} = require('@pact-foundation/pact');

let commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

const applicationVersion = process.env.npm_package_version

var opts = {
  provider: 'test-provider', // where your service will be running during the test, either staging or localhost on CI
  providerBaseUrl: 'https://petstore.swagger.io/v2', // where your service will be running during the test, either staging or localhost on CI
  // providerStatesSetupUrl: 'http://localhost:3002/test/setup', // the url to call to set up states
  pactBrokerUrl: process.env.PACT_BROKER_URL,
  publishVerificationResult: false, // ONLY SET THIS TRUE IN CI!
  providerVersion: applicationVersion, // the application version of the provider 
  pactBrokerUsername: process.env.PACT_BROKER_BASIC_AUTH_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_BASIC_AUTH_PASSWORD
}

return new Verifier(opts).verifyProvider().then(() => {
  console.log('success')
  process.exit(0)
}).catch((error) => {
  console.log('failed', error)
  process.exit(1)
})

// **Options**:

// | Parameter                   | Required? | Type    | Description                                                                                                |
// | --------------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------- |
// | `providerBaseUrl`           | true      | string  | Running API provider host endpoint.                                                                        |
// | `pactBrokerUrl`             | false     | string  | URL of your Pact Broker to dynamically discover relevent pacts to verify. Required if `pactUrls` not given |
// | `provider`                  | false     | string  | Name of the provider if fetching from a Broker                                                             |
// | `tags`                      | false     | array   | Array of tags, used to filter pacts from the Broker                                                        |
// | `pactUrls`                  | false     | array   | Array of local pact file paths or HTTP-based URLs. Required if _not_ using a Pact Broker.                  |
// | `providerStatesSetupUrl`    | false     | string  | URL to send PUT requests to setup a given provider state                                                   |
// | `pactBrokerUsername`        | false     | string  | Username for Pact Broker basic authentication                                                              |
// | `pactBrokerPassword`        | false     | string  | Password for Pact Broker basic authentication                                                              |
// | `publishVerificationResult` | false     | boolean | Publish verification result to Broker (_NOTE_: you should only enable this during CI builds)               |
// | `customProviderHeaders`     | false     | array   | Header(s) to add to provider state set up and pact verification                                            | 
// | `providerVersion`           | false     | string  | Provider version, required to publish verification result to Broker. Optional otherwise.                   |
// | `timeout`                   | false     | number  | The duration in ms we should wait to confirm verification process was successful. Defaults to 30000.       |