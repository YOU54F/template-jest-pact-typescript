import { InteractionObject } from "@pact-foundation/pact";
import * as fs from "fs";
import * as supertest from "supertest";
import { getProvider } from "../provider";

const pactPort = 5100;

const getClient = () => {
  const url = `http://localhost:${pactPort}`;

  return supertest(url);
};
// http://www.soapclient.com
const requestPath = "/xml/soapresponder.wsdl";
const resumeRequest = fs.readFileSync(
  "./src/pact/tests/data/Resume_Request.xml",
  "utf-8"
);
const resumeResponse = fs.readFileSync(
  "./src/pact/tests/data/Resume_Response.xml",
  "utf-8"
);

describe("soap provider pact", () => {
  const provider = getProvider({
    provider: "soap-provider",
    pactPort
  });

  beforeAll(async () => await provider.setup());
  afterEach(async () => await provider.verify());
  afterAll(async () => await provider.finalize());

  describe("Simple Soap Request", () => {
    it("should add two numbers", async () => {
      const interaction: InteractionObject = {
        state: "Any",
        uponReceiving: "a simple soap request",
        withRequest: {
          method: "POST",
          path: requestPath,
          body: resumeRequest,
          headers: {
            "Content-Type": "text/xml;charset=UTF-8"
          }
        },
        willRespondWith: {
          body: resumeResponse,
          headers: {
            "Content-Type": "text/xml;charset=UTF-8"
          },
          status: 200
        }
      };

      await provider.addInteraction(interaction);

      const client = getClient();

      await client
        .post(requestPath)
        .set("Content-Type", "text/xml;charset=UTF-8")
        .send(resumeRequest)
        .expect(200, resumeResponse);
    });
  });
});
