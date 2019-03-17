#!/bin/bash

set -o pipefail
node src/pact/providerTests/verifyProvider_pacts.js | grep -v Created 
