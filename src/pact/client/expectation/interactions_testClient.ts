import { InteractionObject } from "@pact-foundation/pact";
import * as requestResponse from "../../requestResponse";

export const postValidRequest: InteractionObject = {
  state: "A pet 1845563262948980200 exists",
  uponReceiving: "A get request to get a pet",
  willRespondWith: {
    status: 200
  },
  withRequest: {
    method: "GET",
    path: "/v2/pet/1845563262948980200",
    headers: { "api_key": "[]" }
  }
};