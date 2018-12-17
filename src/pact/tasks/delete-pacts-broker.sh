# !/usr/bin/env bash
# This script will delete a pacticipant - use with care
for f in src/pact/pacts/*.json; do
  pacticipant=$(jq '.consumer.name' $f | sed s'/"//g')
  curl -X DELETE \
    -u $PACT_BROKER_BASIC_AUTH_USERNAME:$PACT_BROKER_BASIC_AUTH_PASSWORD \
    $PACT_BROKER_URL/pacticipants/$pacticipant
done