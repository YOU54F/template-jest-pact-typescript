import { InteractionObject } from '@pact-foundation/pact';
import * as jestpact from 'jest-pact';
import * as supertest from 'supertest';

jestpact.pactWith(
  {
    consumer: 'test-consumer',
    provider: 'aws-provider',
    pactfileWriteMode: 'merge'
  },
  async (provider: any) => {
    const client = () => {
      const url = `${provider.mockService.baseUrl}`;
      return supertest(url);
    };

    describe('aws signed gateway test', () => {
      test('should be able to access /helloworld when authenticated', async () => {
        const apiPath = '/helloworld';
        const interaction: InteractionObject = {
          state: 'Is authenticated',
          uponReceiving: 'a validated request to an api protected gateway',
          withRequest: {
            method: 'GET',
            path: '/helloworld'
          },
          willRespondWith: {
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              message: 'Hello from Lambda!'
            },
            status: 200
          }
        };
        await provider.addInteraction(interaction);
        await client().get(apiPath).expect(200);
      });
      test('should not be able to access /helloworld when not authenticated', async () => {
        const apiPath = '/helloworld';
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
            status: 403
          }
        };

        await provider.addInteraction(interaction);

        await client().get(apiPath).expect(403);
      });
    });
  }
);
