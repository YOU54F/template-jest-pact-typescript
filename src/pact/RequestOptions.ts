export const RESPONSE_INVALID_REQUEST = { errors: ["An error occurred"] };
export const RESPONSE_VALID_REQUEST=  { testResult: "validRequest" };
const like = require('@pact-foundation/pact').Matchers.somethingLike;

export const TestRequest = () => {
  return {
          body: {last_name: like('string')},
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      path: "/test"
        }
};


// const like = require('@pact-foundation/pact').Matchers.somethingLike;
// export const TestRequest = (status: string) => {
//   return {
//     last_name: like(status),  
//       }
// };