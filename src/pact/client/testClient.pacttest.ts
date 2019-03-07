import * as supertest from "supertest";
import * as requestResponse from "../requestResponse";
import * as interaction from "./expectation/interactions_testClient";
import { getProvider } from "./expectation/provider_testClient";

const pactPort = 9879;
const provider = getProvider(pactPort);

const getClient = () => {
  const url = `http://localhost:${pactPort}`;
  return supertest(url);
};

describe("Test Swagger Pet-store Example", () => {
    beforeAll(async () => await provider.setup());
    afterEach(async () => await provider.verify());
    afterAll(async () => await provider.finalize());
  
    test("should accept a valid post request to add a pet", async () => {
      await provider.addInteraction(interaction.postValidRequest);
      const client = getClient();

      await client
      .post("/v2/pet")
      .set("Content-Type", "application/json")
      .send(requestResponse.postPetValidRequest)
      .expect(200, requestResponse.postPetValidResponse);

      await provider.verify();
    });

    test("should accept a valid post request to add a pet", async () => {
      await provider.addInteraction(interaction.postInvalidRequest);
      const client = getClient();

      await client
      .post("/v2/pet")
      .set("Content-Type", "application/json")
      .send(requestResponse.postPetInvalidRequest)
      .expect(405);

      await provider.verify();
    });


});