import { handleResult } from 'jest-runner-newman/handle-result';
import { run } from 'newman';

export default run(
  {
    collection: `./pact/postman/collections/test-consumer-json-provider.postman.json`,
    environment: `./pact/postman/env/test-consumer-json-provider.postman.env.json`,
    reporters: ['cli']
    // any other newman configs
  },
  (err, result) => {
    handleResult(err, result);

    // anything else you want
  }
);
