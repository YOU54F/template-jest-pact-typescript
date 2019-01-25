#!/usr/bin/env bash
#This script will publish the branch tag for all specified pacts in /pacts

for f in src/pact/pacts/*.json; do
  consumer=$(jq '.consumer.name' $f | sed s'/"//g')
  git_commit_hash=$(git rev-parse --short HEAD)
  # note we are using sed to URLencode the / in branch name feature/COM-XX
  git_branch=$(git rev-parse --abbrev-ref HEAD | sed s'/[/]/%2f/g' )
  consumer_version=${CIRCLE_BUILD_NUM}-$git_commit_hash
  
  curl -X PUT \-H "Content-Type: application/json" \
    -d @$f \
    -u $PACT_BROKER_BASIC_AUTH_USERNAME:$PACT_BROKER_BASIC_AUTH_PASSWORD \
    $PACT_BROKER_URL/pacticipants/$consumer/versions/$consumer_version/tags/$git_branch
done
