"use strict";

import { Verifier } from "@pact-foundation/pact";
import { VerifierOptions } from "@pact-foundation/pact-node";
import { LogLevel } from "@pact-foundation/pact/dsl/options";

let publishResultsFlag: boolean;
let tagsArray: string[];
let opts: VerifierOptions;
const PACT_PROVIDER_VERSION: string = process.env.PACT_PROVIDER_VERSION || "";
const PACT_BROKER_URL: string = process.env.PACT_BROKER_URL || "";
const PACT_PROVIDER_URL: string = process.env.PACT_PROVIDER_URL || "";
const PACT_PROVIDER_NAME: string = process.env.PACT_PROVIDER_NAME || "";
const PACT_BROKER_BASIC_AUTH_USERNAME: string =
  process.env.PACT_BROKER_BASIC_AUTH_USERNAME || "";
const PACT_BROKER_BASIC_AUTH_PASSWORD: string =
  process.env.PACT_BROKER_BASIC_AUTH_PASSWORD || "";

main();

function main() {
  processTags();
  getOpts();
  performVerification();
}

function getOpts() {
  const providerVersion = PACT_PROVIDER_VERSION;
  if (
    process.env.PACT_PUBLISH_VERIFICATION &&
    process.env.PACT_PUBLISH_VERIFICATION === "true"
  ) {
    publishResultsFlag = true;
  }
  opts = {
    provider: PACT_PROVIDER_NAME, // where your service will be running during the test, either staging or localhost on CI
    providerBaseUrl: PACT_PROVIDER_URL, // where your service will be running during the test, either staging or localhost on CI
    pactBrokerUrl: PACT_BROKER_URL,
    publishVerificationResult: publishResultsFlag || false, // ONLY SET THIS TRUE IN CI!
    validateSSL: true,
    changeOrigin: true,
    providerVersion, // the application version of the provider
    pactBrokerUsername: PACT_BROKER_BASIC_AUTH_USERNAME,
    pactBrokerPassword: PACT_BROKER_BASIC_AUTH_PASSWORD,
    tags: tagsArray,
    logLevel: "info" as LogLevel
  };
  // tslint:disable-next-line: no-console
}

function performVerification() {
  new Verifier(opts)
    .verifyProvider()
    .then(() => {
      // tslint:disable-next-line: no-console
      console.log("successfully verified pacts");
      process.exit(0);
    })
    .catch((error: any) => {
      // tslint:disable-next-line: no-console
      console.log(error);
      process.exit(1);
    });
}

function processTags() {
  if (!process.env.PACT_CONSUMER_TAG) {
    // tslint:disable-next-line: no-console
    console.log(
      "Exited gracefully because Env var PACT_CONSUMER_TAG is not set - Make sure you calling this via an API trigger"
    );
    return process.exit(0);
  } else {
    const tags = process.env.PACT_CONSUMER_TAG.replace(/ /g, "");
    const tagsSlashEncoded = tags.replace(/\//g, "%2F");
    tagsArray = tagsSlashEncoded.split(",");
  }
}
