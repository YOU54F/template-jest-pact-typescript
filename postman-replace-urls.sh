mkdir -p pact/postman/env
for file in pact/postman/collections/*
do
    ext=${file##*.}
    fname=`basename $file $ext`
    postnamefname=pact/postman/env/$fname\env.json
    cp postman_env.json $postnamefname
    npx newman-wrapper $postnamefname "url" $PACT_PROVIDER_URL
done