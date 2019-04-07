import publisher from "@pact-foundation/pact-node";
import * as cp from "child_process";
import { resolve } from "path";

let revision: string;
try {
  revision = cp
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError(
    "Couldn't find a git commit hash, is this a git directory?"
  );
}
let branch: string;
try {
  branch = cp
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim();
} catch (Error) {
  throw new TypeError("Couldn't find a git branch, is this a git directory?");
}

let artefactTag: string;
try {
  artefactTag = cp
    .execSync("git describe")
    .toString()
    .trim();
} catch (Error) {
  const errorMessage = Error.message;
  if (errorMessage.indexOf("fatal") >= 0) {
    if (process.env.CIRCLE_BUILD_NUM) {
      artefactTag = process.env.CIRCLE_BUILD_NUM;
    } else {
      throw new TypeError("Couldn't find a git tag or CIRCLE_BUILD_NUM");
    }
  }
}
const consumerVersion = artefactTag + "-" + revision;

const opts = {
  pactFilesOrDirs: [resolve(process.cwd(), "src/pact/pacts")],
  pactBroker: process.env.PACT_BROKER_URL,
  pactBrokerUsername: process.env.PACT_BROKER_BASIC_AUTH_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_BASIC_AUTH_PASSWORD,
  consumerVersion,
  tags: [branch]
};

publisher
  .publishPacts(opts)
  .then(() => {
    // tslint:disable-next-line: no-console
    console.log("successfully published pacts");
    process.exit(0);
  })
  .catch((error: any) => {
    // tslint:disable-next-line: no-console
    console.log("failed to publish pacts");
    process.exit(1);
  });
