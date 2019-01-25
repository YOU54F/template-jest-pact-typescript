#!/usr/bin/env bash
#This script will publish the generated pact contract for all specified pacts in /pacts

for f in src/pact/pacts/*.json; do
  consumer=$(jq '.consumer.name' $f | sed s'/"//g')
  provider=$(jq '.provider.name' $f | sed s'/"//g')
  git_commit_hash=$(git rev-parse --short HEAD)
  consumer_version=${CIRCLE_BUILD_NUM}-$git_commit_hash

  curl -X PUT \-H "Content-Type: application/json" \
    -d @$f \
    -u $PACT_BROKER_BASIC_AUTH_USERNAME:$PACT_BROKER_BASIC_AUTH_PASSWORD \
    $PACT_BROKER_URL/pacts/provider/$provider/consumer/$consumer/version/$consumer_version
 
done
