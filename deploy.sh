#!/bin/bash

git pull && \
npm i && \
npm run build && \
rm -rf ../html/* && \
cp -r dist/* ../html && \
git log | head -n 3 > ../html/version.html && \
echo "Deployed successfully"

