import { Matchers } from "@pact-foundation/pact";
const { term } = Matchers

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

export const getPetValidResponse = {
  id: 1845563262948980200,
  name: "doggie",
  photoUrls: ["string"],
  tags: [
    {
      id: 0,
      name: "string"
    }
  ],
  status: "available"
};
