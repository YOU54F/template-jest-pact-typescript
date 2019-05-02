import * as supertest from "supertest";
import { getProvider } from "../provider";
import * as interaction from "./expectation/json.expectation";
import * as json from "./requestResponse/json.reqRes";

const pactPort = 9872;
const provider = getProvider({
  pactPort,
  provider: "json-provider"
});

const getClient = () => {
  const url = `http://localhost:${pactPort}`;
  return supertest(url);
};

describe("Test Swagger Pet-store Example", () => {
  beforeAll(async () => await provider.setup());
  afterEach(async () => await provider.verify());
  afterAll(async () => await provider.finalize());

  test("should accept a valid get request to get a pet", async () => {
    await provider.addInteraction(interaction.postValidRequest);
    const client = getClient();

    await client
      .get("/v2/pet/1845563262948980200")
      .set("api_key", "[]")
      .expect(200, json.getPetValidResponse);
    await provider.verify();
  });
});
