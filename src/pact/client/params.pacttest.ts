import { InteractionObject } from "@pact-foundation/pact";
import { regex, term } from "@pact-foundation/pact/dsl/matchers";
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
            path: "/notifications",
            query: {
              signingId: regex({
                generate: "9eb2484d-405e-4ff7-bc3a-b0181e4efb30",
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
          .get("/notifications?signingId=123")
          .expect(200);
      });
    });

    describe("path param matcher test", () => {
      it("should respond 200 when a notification2 is send", async () => {
        const interaction: InteractionObject = {
          state: "Service is up and healthy",
          uponReceiving: "a notification2",
          withRequest: {
            method: "GET",
            path: term({
              generate: "/notifications?signingId=123",
              matcher: "/notifications\\?signingId\\=\\d+"
            })
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
          .get("/notifications?signingId=123")
          .expect(200);
      });
    });
  }
);
