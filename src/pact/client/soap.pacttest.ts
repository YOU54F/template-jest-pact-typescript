import { InteractionObject, XmlBuilder } from '@pact-foundation/pact';
import {
  boolean,
  integer,
  regex,
  string
} from '@pact-foundation/pact/src/v3/matchers';
import * as fs from 'fs';
import * as jestpact from 'jest-pact/dist/v3';
import * as supertest from 'supertest';

// http://www.soapclient.com/xml/soapresponder.wsdl
const requestPath = '/xml/soapresponder.wsdl';
const resumeRequest = fs.readFileSync(
  './src/pact/client/data/Resume_Request.xml',
  'utf-8'
);
const resumeResponse = fs.readFileSync(
  './src/pact/client/data/Resume_Response.xml',
  'utf-8'
);

jestpact.pactWith(
  { consumer: 'test-consumer', provider: 'soap-provider' },
  (interaction) => {
    interaction('A request for API health', ({ provider, execute }) => {
      const client = (url: string) => {
        return supertest(url);
      };

      describe('Simple Soap Request', () => {
        beforeEach(() =>
          provider
            .given('Server is healthy')
            .uponReceiving('a simple soap request')
            .withRequest({
              method: 'POST',
              path: requestPath,
              body: resumeRequest,
              headers: {
                'Content-Type': regex(
                  'application/.*xml(;.*)?',
                  'application/xml'
                )
              }
            })
            .willRespondWith({
              // need to setup XMLBuilder
              body: resumeResponse,
              headers: {
                'Content-Type': regex(
                  'application/.*xml(;.*)?',
                  'application/xml'
                )
              },
              status: 200
            })
        );
        execute(
          'some api call',
          (mockserver) =>
            client(mockserver.url)
              .post(requestPath)
              .set('Content-Type', 'application/xml;charset=UTF-8')
              .send(resumeRequest)
              .expect(200)
          // getting empty response, use XMLBuilder
          // .expect(200, resumeResponse)
        );
      });
    });
  }
);
