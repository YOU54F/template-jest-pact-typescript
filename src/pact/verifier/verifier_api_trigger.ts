'use strict';

import { Verifier } from '@pact-foundation/pact';
import { VerifierOptions } from '@pact-foundation/pact/src/dsl/verifier/types';

import * as aws4 from 'aws4';
import * as supertest from 'supertest';
import url = require('url');

let authHeaders: {
  Host?: string;
  Authorization?: string;
  ['X-Amz-Security-Token']?: string;
  ['X-Amz-Date']?: string;
};
let publishResultsFlag: boolean;
let tagsArray: string[];
let opts: VerifierOptions;
const PACT_PROVIDER_VERSION: string = process.env.PACT_PROVIDER_VERSION || '';
const PACT_BROKER_BASE_URL: string = process.env.PACT_BROKER_BASE_URL || '';
const PACT_PROVIDER_URL: string = process.env.PACT_PROVIDER_URL || '';
const PACT_PROVIDER_NAME: string = process.env.PACT_PROVIDER_NAME || '';
const PACT_BROKER_TOKEN: string = process.env.PACT_BROKER_TOKEN || '';

main();

function main() {
  try {
    processTags();
    getOpts();
    performVerification();
  } catch (err) {
    throw Error(err);
  }
}

function getOpts() {
  const providerVersion = PACT_PROVIDER_VERSION;
  if (
    process.env.PACT_PUBLISH_VERIFICATION &&
    process.env.PACT_PUBLISH_VERIFICATION === 'true'
  ) {
    publishResultsFlag = true;
  }
  let signedHost: string;
  let signedXAmzSecurityToken: string;
  let signedXAmzDate: string;
  let signedAuthorization: string;
  opts = {
    stateHandlers: {
      'Is authenticated': async () => {
        const requestUrl = PACT_PROVIDER_URL;
        const host = new url.URL(requestUrl).host;
        const pathname = new url.URL(requestUrl).pathname;
        const options = {
          host,
          path: pathname,
          headers: {}
        };
        await aws4.sign(options);
        aws4.sign(options, {
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          sessionToken: process.env.AWS_SESSION_TOKEN
        });
        authHeaders = options.headers;
        signedHost = authHeaders.Host;
        signedXAmzSecurityToken = authHeaders['X-Amz-Security-Token'];
        signedXAmzDate = authHeaders['X-Amz-Date'];
        signedAuthorization = authHeaders.Authorization;
        return Promise.resolve({
          description: 'AWS signed headers created'
        });
      },
      'Is not authenticated': async () => {
        signedHost = null;
        signedXAmzSecurityToken = null;
        signedXAmzDate = null;
        signedAuthorization = null;
        return Promise.resolve({
          description: `Blank aws headers created`
        });
      },
      'A pet 1845563262948980200 exists': async () => {
        const requestUrl = process.env.PACT_PROVIDER_URL;
        const pet = '1845563262948980200';
        const object = {
          id: 0,
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
      }
    },
    requestFilter: (req, res, next) => {
      // over-riding request headers with AWS credentials

      if (signedHost != null) {
        req.headers.Host = signedHost;
      }
      if (signedXAmzSecurityToken != null) {
        req.headers['X-Amz-Security-Token'] = signedXAmzSecurityToken;
      }
      if (signedXAmzDate != null) {
        req.headers['X-Amz-Date'] = signedXAmzDate;
      }
      if (signedAuthorization != null) {
        req.headers.Authorization = signedAuthorization;
      }
      next();
    },
    provider: PACT_PROVIDER_NAME, // where your service will be running during the test, either staging or localhost on CI
    providerBaseUrl: PACT_PROVIDER_URL, // where your service will be running during the test, either staging or localhost on CI
    pactBrokerUrl: PACT_BROKER_BASE_URL,
    publishVerificationResult: publishResultsFlag || false, // ONLY SET THIS TRUE IN CI!
    validateSSL: true,
    changeOrigin: true,
    providerVersion, // the application version of the provider
    pactBrokerToken: PACT_BROKER_TOKEN,
    providerVersionBranch: tagsArray[0],
    logLevel: 'error'
  };
}

function performVerification() {
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
}

function processTags() {
  if (!process.env.PACT_CONSUMER_TAG) {
    // tslint:disable-next-line: no-console
    console.log(
      'Exited gracefully because Env var PACT_CONSUMER_TAG is not set - Make sure you calling this via an API trigger'
    );
    return process.exit(0);
  } else {
    const tags = process.env.PACT_CONSUMER_TAG.replace(/ /g, '');
    const tagsSlashEncoded = tags.replace(/\//g, '%2F');
    tagsArray = tagsSlashEncoded.split(',');
  }
}
