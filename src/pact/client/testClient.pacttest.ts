import * as supertest from "supertest";
import { getProvider } from "../provider";
import * as interaction from "./expectation/interactions_testClient";

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

  test("should accept a valid get request to get a pet", async () => {
    await provider.addInteraction(interaction.postValidRequest);
    const client = getClient();

    await client
      .get("/v2/pet/1845563262948980200")
      .set("api_key", "[]")
      .expect(200);

    await provider.verify();
  });
});
