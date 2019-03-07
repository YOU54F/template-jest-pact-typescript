import { InteractionObject } from "@pact-foundation/pact";
import * as requestResponse from "../../requestResponse";

export const postValidRequest: InteractionObject = {
  state: "No pet exists",
  uponReceiving: "A post request to add a pet",
  willRespondWith: {
    body: requestResponse.postPetValidResponse,
    headers: { "Content-Type": "application/xml" },
    status: 200
  },
  withRequest: {
    headers: { "Content-Type": "application/json" },
    body: requestResponse.postPetValidRequest,
    method: "POST",
    path: "/v2/pet"
  }
};
export const postInvalidRequest: InteractionObject = {
  state: "No pet exists",
  uponReceiving: "A post request to add a pet with an invalid ID",
  willRespondWith: {
    headers: { "Content-Type": "application/xml" },
    status: 405
  },
  withRequest: {
    headers: { "Content-Type": "application/json" },
    body: requestResponse.postPetInvalidRequest,
    method: "POST",
    path: "/v2/pet"
  }
};
