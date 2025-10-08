#!/bin/bash
npx prisma db push

if [ ! -f ./.setupfinished ]; then
  npx prisma generate
  node populate.js
  touch .setupfinished
  node .output/server/index.mjs
  exit
fi;

echo "Setup already ran in this environment. If you want to run it again, just delete the .setupfinished file and run this script again."
echo "Starting..."
node .output/server/index.mjs
exit