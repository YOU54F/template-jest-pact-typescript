import { InteractionObject } from "@pact-foundation/pact";
import { eachLike, regex, term } from "@pact-foundation/pact/dsl/matchers";
import * as jestpact from "jest-pact";
import * as supertest from "supertest";
const port = 9999;

const getClient = () => {
  const url = `http://localhost:${port}`;

  return supertest(url);
};

jestpact.pactWith(
  { consumer: "test-consumer", provider: "param-provider", port },
  async (provider: any) => {
    describe("query param matcher test", () => {
      it("should respond 200 when a notification is sent", async () => {
        const interaction: InteractionObject = {
          state: "Service is up and healthy",
          uponReceiving: "a notification",
          withRequest: {
            method: "GET",
            path: "/paramTests",
            query: {
              param1: term({
                generate: "12345",
                matcher: "\\d+"
              })
            }
          },
          willRespondWith: {
            status: 200,
            body: "",
            headers: {
              "Content-Type": "application/json"
            }
          }
        };

        await provider.addInteraction(interaction);

        await getClient()
          .get("/paramTests?param1=123")
          .expect(200);
      });
    });

    describe("query param matcher test2", () => {
      it("should respond 200 when 2 param1's are sent", async () => {
        const interaction: InteractionObject = {
          state: "Service is up and healthy",
          uponReceiving: "a notification2",
          withRequest: {
            method: "GET",
            path: "/paramTests",
            query: {
              param1: eachLike("123")
            }
          },
          willRespondWith: {
            status: 200,
            body: "",
            headers: {
              "Content-Type": "application/json"
            }
          }
        };

        await provider.addInteraction(interaction);

        await getClient()
          .get("/paramTests?param1=12345&param1=54321")
          .expect(200);
      });
    });

    describe("query param matcher test3", () => {
      it("should respond 200 when 2 diff params's are sent", async () => {
        const interaction: InteractionObject = {
          state: "Service is up and healthy",
          uponReceiving: "a notification3",
          withRequest: {
            method: "GET",
            path: "/paramTests",
            query: {
              param1: regex({
                generate: "12345",
                matcher: "\\d+"
              }),
              param2: regex({
                generate: "12345",
                matcher: "\\d+"
              })
            }
          },
          willRespondWith: {
            status: 200,
            body: "",
            headers: {
              "Content-Type": "application/json"
            }
          }
        };

        await provider.addInteraction(interaction);

        await getClient()
          .get("/paramTests?param1=123&param2=321")
          .expect(200);
      });
    });
  }
);
