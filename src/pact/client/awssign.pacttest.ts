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
        const interaction: InteractionObject = {
          state: 'Is authenticated',
          uponReceiving: 'a validated request to an api protected gateway',
          withRequest: {
            method: 'GET',
            path: '/pets'
          },
          willRespondWith: {
            headers: {
              'Content-Type': 'application/json'
            },
            body: [
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
            ],
            status: 200
          }
        };
        await provider.addInteraction(interaction);
        await client().get(apiPath).expect(200);
      });
      test('should be able create /pets when authenticated', async () => {
        const apiPath = '/pets';
        const interaction: InteractionObject = {
          state: 'Is authenticated',
          uponReceiving:
            'a validated request to an api protected gateway to create a pet',
          withRequest: {
            method: 'POST',
            path: '/pets',
            body: {
              type: 'cat',
              price: 123.11
            }
          },
          willRespondWith: {
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              pet: {
                type: 'cat',
                price: 123.11
              },
              message: 'success'
            },
            status: 200
          }
        };
        await provider.addInteraction(interaction);
        await client()
          .post(apiPath)
          .send({
            type: 'cat',
            price: 123.11
          })
          .expect(200);
      });
      test('should not be able to access /pets when not authenticated', async () => {
        const apiPath = '/pets';
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
