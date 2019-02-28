#!/bin/bash

git pull && \
npm i && \
npm run build && \
rm -rf ../html/* && \
cp -r dist/* ../html && \
echo "Deployed successfully"

