#!/bin/bash

set -o pipefail
ts-node src/pact/publisher/publish.ts | grep -v Created 