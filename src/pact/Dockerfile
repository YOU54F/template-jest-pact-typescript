FROM pactfoundation/pact-stub-server

COPY pacts /app/pacts

CMD ["--file", "pacts/test-consumer-test-provider.json", "-p", "8080", "--loglevel", "warn"]
