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
    headers: { "Content-Type": "application/json" },
    body: requestResponse.TestRequestMatcher('anyString'),
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
    headers: { "Content-Type": "application/json" },
    body: requestResponse.TestRequestMatcher(null),
    method: "POST",
    path: "/test"
  }
};

export const fallThroughRequest: InteractionObject = {
  state: "A request with application/json HEADER and no body",
  uponReceiving: "A request with application/json HEADER and no body",
  willRespondWith: {
    status: 404
  },
  withRequest: {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    path: "/test"
  }
}