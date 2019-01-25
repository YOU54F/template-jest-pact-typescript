export const RESPONSE_INVALID_REQUEST = { errors: ["An error occurred"] };
export const RESPONSE_VALID_REQUEST = { testResult: "validRequest" };
import {
  boolean,
  decimal,
  eachLike,
  hexadecimal,
  integer,
  ipv4Address,
  ipv6Address,
  ISO8601_DATE_FORMAT,
  iso8601Date,
  iso8601DateTime,
  iso8601DateTimeWithMillis,
  iso8601Time,
  rfc3339Timestamp,
  somethingLike,
  term,
  uuid,
  validateExample,
  extractPayload,
  isMatcher
} from "@pact-foundation/pact/dsl/matchers";

function matcherRegexString(status: string) {
  if (status === null) {
    return "";
  } else {
    return term({
      matcher: "\\w+",
      generate: "string"
    });
  }
}

export const TestRequest = (status: string) => {
  return {
    key: status
  };
};

export const TestRequestMatcher = (status: string) => {
  return {
    key: matcherRegexString(status)
  };
};
