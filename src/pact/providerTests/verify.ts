// 'use strict'

import { Verifier, VerifierOptions } from "@pact-foundation/pact";
import { LogLevel } from "@pact-foundation/pact/dsl/options";
import * as cp from "child_process";
import * as supertest from "supertest";

let revision: string;
let artefactTag: string;
let branch: string;
let publishResultsFlag: boolean;
let tagsArray: string[];

try {
  revision = cp
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError(
    "Couldn't find a git commit hash, is this a git directory?"
  );
}

try {
  branch = cp
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError("Couldn't find a git branch, is this a git directory?");
}

try {
  artefactTag = cp
    .execSync("git describe")
    .toString()
    .trim();
} catch (Error) {
  const errorMessage = Error.message;
  if (errorMessage.indexOf("fatal") >= 0) {
    if (process.env.CIRCLE_BUILD_NUM) {
      artefactTag = process.env.CIRCLE_BUILD_NUM;
    } else {
      throw new TypeError("Couldn't find a git tag or CIRCLE_BUILD_NUM");
    }
  }
}

const providerVersion = artefactTag + "-" + revision;

if (!process.env.PACT_CONSUMER_TAG) {
  tagsArray = [branch];
} else {
  const tags = process.env.PACT_CONSUMER_TAG.replace(/ /g, "");
  const tagsSlashEncoded = tags.replace(/\//g, "%2F");
  tagsArray = tagsSlashEncoded.split(",");
}

if (
  process.env.PACT_PUBLISH_VERIFICATION &&
  process.env.PACT_PUBLISH_VERIFICATION === "true"
) {
  publishResultsFlag = true;
}

const opts: VerifierOptions = {
  stateHandlers: {
    "A pet 1845563262948980200 exists": async () => {
      const url = process.env.PACT_PROVIDER_URL;
      const pet = "1845563262948980200";
      const object = {
        id: 0,
        category: {
          id: pet,
          name: "string"
        },
        name: "doggie",
        photoUrls: ["string"],
        tags: [
          {
            id: 0,
            name: "string"
          }
        ],
        status: "available"
      };
      const res = await supertest(url)
        .post(`/v2/pet`)
        .send(object)
        .set("api_key", "[]")
        .expect(200);
      return Promise.resolve(res);
    }
  },
  provider: process.env.PACT_PROVIDER_NAME, // where your service will be running during the test, either staging or localhost on CI
  providerBaseUrl: process.env.PACT_PROVIDER_URL, // where your service will be running during the test, either staging or localhost on CI
  pactBrokerUrl: process.env.PACT_BROKER_URL,
  publishVerificationResult: publishResultsFlag || false, // ONLY SET THIS TRUE IN CI!
  validateSSL: true,
  changeOrigin: true,
  providerVersion, // the application version of the provider
  pactBrokerUsername: process.env.PACT_BROKER_BASIC_AUTH_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_BASIC_AUTH_PASSWORD,
  tags: tagsArray,
  logLevel: "error" as LogLevel
};

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

try {
  revision = cp
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError(
    "Couldn't find a git commit hash, is this a git directory?"
  );
}

try {
  branch = cp
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError("Couldn't find a git branch, is this a git directory?");
}

try {
  artefactTag = cp
    .execSync("git describe")
    .toString()
    .trim();
} catch (Error) {
  const errorMessage = Error.message;
  if (errorMessage.indexOf("fatal") >= 0) {
    if (process.env.CIRCLE_BUILD_NUM) {
      artefactTag = process.env.CIRCLE_BUILD_NUM;
    } else {
      throw new TypeError("Couldn't find a git tag or CIRCLE_BUILD_NUM");
    }
  }
}
