#!/bin/bash

set -o pipefail
ts-node src/pact/verifier/verify/verifier_api_trigger.ts | grep -v Created
