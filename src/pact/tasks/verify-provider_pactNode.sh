#!/bin/bash

export PACT_BROKER_URL='http://pact.you54f.co.uk'
set -o pipefail
node src/pact/providerTests/verifyProvider_pactNode.js | grep -v Created

