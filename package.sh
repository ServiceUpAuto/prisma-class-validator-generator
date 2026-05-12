#!/bin/bash
set -euo pipefail
START_TIME=$SECONDS

echo "Building package..."
rm -rf lib package
mkdir package

npm run build

echo "Copying files..."
cp -r lib package/lib
cp package.json README.md LICENSE package

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Done in $ELAPSED_TIME seconds!"
