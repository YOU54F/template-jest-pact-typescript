import { InteractionObject } from "@pact-foundation/pact";
import {
  eachLike,
  somethingLike,
  uuid
} from "@pact-foundation/pact/dsl/matchers";
import * as supertest from "supertest";
import { getProvider } from "../provider";

const getClient = (port: number) => {
  const url = `http://localhost:${port}`;
  return supertest(url);
};

describe("Test Service service provider pact", () => {
  const provider = getProvider({
    pactPort: 12000,
    provider: "test-service"
  });

  beforeAll(async () => await provider.setup());
  afterEach(async () => await provider.verify());
  afterAll(async () => await provider.finalize());

  it("should respond 200 when a notification is send", async () => {
    const interaction: InteractionObject = {
      state: "Service is up and healthy",
      uponReceiving: "a notification",
      withRequest: {
        method: "GET",
        path: "/notifications",
        query: {
          signingId: somethingLike("9eb2484d-405e-4ff7-bc3a-b0181e4efb30")
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

    const client = getClient(provider.opts.port);
    await client
      .get("/notifications?signingId=9eb2484d-405e-4ff7-bc3a-b0181e4efb30")
      .expect(200);
  });
});
