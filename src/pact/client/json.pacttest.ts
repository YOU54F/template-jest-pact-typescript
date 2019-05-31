import * as jestpact from "jest-pact";
import * as supertest from "supertest";
import * as interaction from "./expectation/json.expectation";
import * as json from "./requestResponse/json.reqRes";

const port = 9872;

const getClient = () => {
  const url = `http://localhost:${port}`;

  return supertest(url);
};

jestpact.pactWith(
  { consumer: "test-consumer", provider: "json-provider", port },
  async (provider: any) => {
    test("should accept a valid get request to get a pet", async () => {
      await provider.addInteraction(interaction.postValidRequest);

      await getClient()
        .get("/v2/pet/1845563262948980200")
        .set("api_key", "[]")
        .expect(200, json.getPetValidResponse);
      await provider.verify();
    });
  }
);
