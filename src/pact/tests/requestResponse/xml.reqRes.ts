import { term } from "@pact-foundation/pact/dsl/matchers";

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

export const getPetValidResponse = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Pet>
  <category>
    <id>0</id>
    <name>string</name>
  </category>
  <id>1845563262948980200</id>
  <name>doggie</name>
  <photoUrls>
    <photoUrl>string</photoUrl>
  </photoUrls>
  <status>available</status>
  <tags>
    <tag>
      <id>0</id>
      <name>string</name>
    </tag>
  </tags>
</Pet>`;
