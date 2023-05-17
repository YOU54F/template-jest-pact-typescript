'use strict';

import { Verifier } from '@pact-foundation/pact';
import { VerifierOptions } from '@pact-foundation/pact/src/dsl/verifier/types';
import * as aws4 from 'aws4';
import * as cp from 'child_process';
import * as supertest from 'supertest';
import url = require('url');

let revision: string;
let branch: string;
let publishResultsFlag: boolean;

const providerBaseUrl =
  process.env.PACT_PROVIDER_URL ?? 'https://petstore.swagger.io';

try {
  revision = cp
    .execSync('git rev-parse HEAD', { stdio: 'pipe' })
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError(
    "Couldn't find a git commit hash, is this a git directory?"
  );
}

try {
  branch = cp
    .execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' })
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError("Couldn't find a git branch, is this a git directory?");
}

const providerVersion = revision;

if (
  process.env.PACT_PUBLISH_VERIFICATION &&
  process.env.PACT_PUBLISH_VERIFICATION === 'true'
) {
  publishResultsFlag = true;
}
let setAuth: boolean;

const opts: VerifierOptions = {
  stateHandlers: {
    'A pet 1845563262948980200 exists': async () => {
      const requestUrl = providerBaseUrl;
      const pet = '1845563262948980200';
      const object = {
        id: pet,
        category: {
          id: pet,
          name: 'string'
        },
        name: 'doggie',
        photoUrls: ['string'],
        tags: [
          {
            id: 0,
            name: 'string'
          }
        ],
        status: 'available'
      };
      const res = await supertest(requestUrl)
        .post(`/v2/pet`)
        .send(object)
        .set('api_key', '[]')
        .expect(200);
      return Promise.resolve({
        description: 'added doggo',
        res: res.body.id
      });
    },
    'Is authenticated': async () => {
      setAuth = true;
      return Promise.resolve({
        description: 'AWS setAuth flag set'
      });
    },
    'Is not authenticated': async () => {
      setAuth = false;
      return Promise.resolve({
        description: 'AWS setAuth flag unset'
      });
    }
  },
  requestFilter: (req, res, next) => {
    if (setAuth) {
      console.log('setting auth overrides for AWS', {
        path: req.path,
        method: req.method
      });
      const requestUrl = providerBaseUrl;
      const host = new url.URL(requestUrl).host;
      const apiroute = new url.URL(requestUrl).pathname;
      let options: aws4.Request = {
        host,
        path: apiroute + req.path,
        headers: {}
      };
      if (req.method === 'POST') {
        options = {
          ...options,
          body: JSON.stringify(req.body),
          headers: { 'Content-Type': 'application/json' }
        };
      }
      aws4.sign(options, {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
        // // The following is required if using AWS STS to assume a role
        // sessionToken: process.env.AWS_SESSION_TOKEN
      });
      const authHeaders = options.headers;
      req.headers['Host'] = authHeaders['Host'].toString();
      req.headers['X-Amz-Date'] = authHeaders['X-Amz-Date'].toString();
      req.headers['Authorization'] = authHeaders['Authorization'].toString();
      // // The following is required if using AWS STS to assume a role
      // req.headers["X-Amz-Security-Token"] =  authHeaders["X-Amz-Security-Token"];
      setAuth = false;
    }

    next();
  },
  provider: process.env.PACT_PROVIDER_NAME ?? 'aws-provider', // where your service will be running during the test, either staging or localhost on CI
  providerBaseUrl: providerBaseUrl, // where your service will be running during the test, either staging or localhost on CI
  pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  publishVerificationResult: publishResultsFlag || false, // ONLY SET THIS TRUE IN CI!
  validateSSL: true,
  changeOrigin: true,
  providerVersion, // the application version of the provider
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  providerVersionBranch: branch,
  logLevel: 'error',
  consumerVersionSelectors: [{ mainBranch: true }, { deployedOrReleased: true }]
};

new Verifier(opts)
  .verifyProvider()
  .then(() => {
    // tslint:disable-next-line: no-console
    console.log('successfully verified pacts');
    process.exit(0);
  })
  .catch((error) => {
    // tslint:disable-next-line: no-console
    console.log(error);
    process.exit(1);
  });
