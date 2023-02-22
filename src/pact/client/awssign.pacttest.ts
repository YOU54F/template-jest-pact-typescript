import { InteractionObject } from '@pact-foundation/pact';
import * as jestpact from 'jest-pact';
import * as supertest from 'supertest';

jestpact.pactWith(
  {
    consumer: 'test-consumer',
    provider: 'aws-provider',
    pactfileWriteMode: 'merge'
  },
  async (provider) => {
    const client = () => {
      const url = `${provider.mockService.baseUrl}`;
      return supertest(url);
    };

    describe('aws signed gateway test', () => {
      test('should be able to access /pets when authenticated', async () => {
        const apiPath = '/pets';
        const expectedStatusCode = 200
        const expectedResponseBody = [
          {
            id: 1,
            type: 'dog',
            price: 249.99
          },
          {
            id: 2,
            type: 'cat',
            price: 124.99
          },
          {
            id: 3,
            type: 'fish',
            price: 0.99
          }
        ]
        const interaction: InteractionObject = {
          state: 'Is authenticated',
          uponReceiving: 'a validated request to an api protected gateway',
          withRequest: {
            method: 'GET',
            path: apiPath
          },
          willRespondWith: {
            headers: {
              'Content-Type': 'application/json'
            },
            body: expectedResponseBody,
            status: expectedStatusCode
          }
        };
        await provider.addInteraction(interaction);
        await client().get(apiPath).expect(expectedStatusCode);
      });
      test('should be able create /pets when authenticated', async () => {
        const apiPath = '/pets';
        const requestBody = {
          type: 'cat',
          price: 123.11
        }
        const expectedStatusCode = 200
        const expectedResponseBody = {
          pet: requestBody,
          message: 'success'
        }
        const interaction: InteractionObject = {
          state: 'Is authenticated',
          uponReceiving:
            'a validated request to an api protected gateway to create a pet',
          withRequest: {
            method: 'POST',
            path: apiPath,
            body: requestBody
          },
          willRespondWith: {
            headers: {
              'Content-Type': 'application/json'
            },
            body: expectedResponseBody,
            status: expectedStatusCode
          }
        };
        await provider.addInteraction(interaction);
        await client()
          .post(apiPath)
          .send(requestBody)
          .expect(expectedStatusCode);
      });
      test('should not be able to access /pets when not authenticated', async () => {
        const apiPath = '/pets';
        const expectedStatusCode = 403
        const interaction: InteractionObject = {
          state: 'Is not authenticated',
          uponReceiving: 'a non-validated request to an api protected gateway',
          withRequest: {
            method: 'GET',
            path: apiPath
          },
          willRespondWith: {
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              message: 'Missing Authentication Token'
            },
            status: expectedStatusCode
          }
        };

        await provider.addInteraction(interaction);

        await client().get(apiPath).expect(expectedStatusCode);
      });
    });
  }
);
