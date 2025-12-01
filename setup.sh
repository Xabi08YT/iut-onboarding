#!/bin/bash
bunx prisma db push

if [ ! -f ./.setupfinished ]; then
  bunx prisma generate
  bunx populate.js
  touch .setupfinished
  bunx .output/server/index.mjs
  exit
fi;

echo "Setup already ran in this environment. If you want to run it again, just delete the .setupfinished file and run this script again."
echo "Starting..."
bun .output/server/index.mjs
exit