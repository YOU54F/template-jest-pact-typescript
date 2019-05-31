import { InteractionObject } from "@pact-foundation/pact";
import * as jestpact from "jest-pact";
import * as supertest from "supertest";

const port = 9777;

const getClient = () => {
  const url = `http://localhost:${port}`;

  return supertest(url);
};

jestpact.pactWith(
  { consumer: "test-consumer", provider: "aws-provider", port },
  async (provider: any) => {
    describe("aws signed gateway test", () => {
      test("should be able to access /helloworld when authenticated", async () => {
        const apiPath = "/helloworld";
        const interaction: InteractionObject = {
          state: "Is authenticated",
          uponReceiving: "a validated request to an api protected gateway",
          withRequest: {
            method: "GET",
            path: apiPath
          },
          willRespondWith: {
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              message: "Hello from Lambda!"
            },
            status: 200
          }
        };

        await provider.addInteraction(interaction);

        await getClient()
          .get(apiPath)
          .expect(200);
      });
      test("should not be able to access /helloworld when not authenticated", async () => {
        const apiPath = "/helloworld";
        const interaction: InteractionObject = {
          state: "Is not authenticated",
          uponReceiving: "a non-validated request to an api protected gateway",
          withRequest: {
            method: "GET",
            path: apiPath
          },
          willRespondWith: {
            headers: {
              "Content-Type": "application/json"
            },
            body: {
              message: "Missing Authentication Token"
            },
            status: 403
          }
        };

        await provider.addInteraction(interaction);

        await getClient()
          .get(apiPath)
          .expect(403);
      });
    });
  }
);
