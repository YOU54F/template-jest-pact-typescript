import { InteractionObject, Matchers } from '@pact-foundation/pact';
const { term } = Matchers;
import * as jestpact from 'jest-pact';
import * as supertest from 'supertest';

jestpact.pactWith(
  {
    consumer: 'test-consumer',
    provider: 'request-path-provider',
    pactfileWriteMode: 'merge'
  },
  async (provider) => {
    const client = () => {
      const url = `${provider.mockService.baseUrl}`;
      return supertest(url);
    };

    describe('GET /request/path/:requestId', () => {
      it('should return a status LOOSE_MATCH for any request id bar 2', async () => {
        const requestId = '1';
        const requestPath = `/request/path/${requestId}`;

        const expectedBody = {
          id: requestId,
          status: 'LOOSE_MATCH'
        };

        const interaction: InteractionObject = {
          state: 'Any',
          uponReceiving: `a GET to ${requestPath}`,
          withRequest: {
            method: 'GET',
            path: term({
              generate: requestPath,
              matcher: '/request/path/(?![2]$)\\d+'
            })
          },
          willRespondWith: {
            body: expectedBody,
            headers: {
              'Content-Type': 'application/json'
            },
            status: 200
          }
        };

        await provider.addInteraction(interaction);

        await client().get(requestPath).expect(200, expectedBody);
      });

      it('should return a status RIGID_MATCH for any request id bar 2', async () => {
        const requestId = '2';
        const requestPath = `/request/path/${requestId}`;

        const expectedBody = {
          id: requestId,
          status: 'RIGID_MATCH'
        };

        const interaction: InteractionObject = {
          state: 'Any',
          uponReceiving: `a GET to ${requestPath}`,
          withRequest: {
            method: 'GET',
            path: requestPath
          },
          willRespondWith: {
            body: expectedBody,
            headers: {
              'Content-Type': 'application/json'
            },
            status: 200
          }
        };

        await provider.addInteraction(interaction);

        await client().get(requestPath).expect(200, expectedBody);
      });
    });
  }
);
