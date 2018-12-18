import { InteractionObject } from "@pact-foundation/pact";
import * as requestResponse from "../../requestResponse";



export const postValidRequest: InteractionObject = {
  state: "Then I expect to recieve an error",
  uponReceiving: "When I send an valid request with last_name happyPath",
  willRespondWith: {
    body: requestResponse.RESPONSE_VALID_REQUEST,
    status: 200
  },
  withRequest: {
    body: requestResponse.TestRequestMatcher('happyPath'),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    path: "/test"
  }
  
};

export const postInvalidRequest: InteractionObject = {
  state: "Then I expect to recieve an error",
  uponReceiving: "When I send an invalid request",
  willRespondWith: {
    body: requestResponse.RESPONSE_INVALID_REQUEST,
    status: 400
  },
  withRequest: {
    body: requestResponse.TestRequestMatcher(''),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    path: "/test"
  }
};