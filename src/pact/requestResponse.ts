export const RESPONSE_INVALID_REQUEST = { errors: ["An error occurred"] };
export const RESPONSE_VALID_REQUEST=  { testResult: "validRequest" };
const like = require('@pact-foundation/pact').Matchers.somethingLike;

export const TestRequest = (status: string) => {
  return {
    last_name: status,
  }
};


export const TestRequestMatcher = (status: string) => {
  return {
    last_name: like(status),
  }
};

