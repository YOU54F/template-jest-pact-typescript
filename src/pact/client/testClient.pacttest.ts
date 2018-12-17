import { expect } from "chai";
import * as request from "request-promise-native";
import * as requestResponse from "../requestResponse";
import * as interaction from "./expectation/interactions_testClient";
import { getProvider } from "./expectation/provider_testClient";

const pactPort = 9879;
const provider = getProvider(pactPort);

const sendRequest = (req: {}) => {
  const endpointURL = "http://localhost:" + pactPort + "/test";
  const options = {
    body: req,
    headers: {
      "Content-Type": "application/json"
    },
    json: true,
    simple: false,
    uri: endpointURL
  };

  return request.post(options);
};

describe("Test Service Handling", () => {
  beforeAll(async () => {
    jest.setTimeout(10000);
    await provider.setup();
  });

  afterAll(async () => {
    jest.setTimeout(10000);
    await provider.finalize();
  });

  describe("#postValidRequest", () => {
    test("should send a valid request and get a valid response", async () => {
      await provider.addInteraction(interaction.postValidRequest);
      const response = await sendRequest(
        requestResponse.TestRequest("happyPath")
      );
      expect(response).to.deep.equal(
        requestResponse.RESPONSE_VALID_REQUEST
      );
      await provider.verify();
    });
  });

  describe("#postInvalid", () => {
    test("should send a invalid request and return and error", async () => {
      await provider.addInteraction(interaction.postInvalidRequest);
      const response = await sendRequest(
        requestResponse.TestRequest("")
      );
      expect(response).to.deep.equal(requestResponse.RESPONSE_INVALID_REQUEST);
      await provider.verify();
    });
  });
});
