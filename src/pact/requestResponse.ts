export const postPetValidResponse = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`

import {
  term,
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
};

export const postPetValidRequest = {
  "id": 0,
  "category": {
    "id": 0,
    "name": "string"
  },
  "name": "doggie",
  "photoUrls": [
    "string"
  ],
  "tags": [
    {
      "id": 0,
      "name": "string"
    }
  ],
  "status": "available"
};
export const postPetInvalidRequest = {
  "id": "abc",
  "category": {
    "id": 0,
    "name": "string"
  },
  "name": "doggie",
  "photoUrls": [
    "string"
  ],
  "tags": [
    {
      "id": 0,
      "name": "string"
    }
  ],
  "status": `available`
};


