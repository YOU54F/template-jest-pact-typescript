export const RESPONSE_INVALID_REQUEST = { errors: ["An error occurred"] };
export const RESPONSE_VALID_REQUEST=  { testResult: "validRequest" };

export const TestRequest = (status: string) => {
  return {
        last_name: status,  
      }
};