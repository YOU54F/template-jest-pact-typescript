mkdir -p pact/postman
mkdir -p pact/postman/collections
for file in pact/pacts/*
do
    ext=${file##*.}
    fname=`basename $file $ext`
    postnamefname=$fname\postman.json
    pmpact $file -o pact/postman/collections/$postnamefname
done