#!/bin/bash

set -o pipefail
ts-node src/pact/providerTests/publish.ts | grep -v Created 