if [ ! -f ./.setupfinished ]; then
  npx prisma db push
  npx prisma generate
  node createFirstUser.js
  touch .setupfinished
  exit
fi;

echo "Setup already ran in this environment. If you want to run it again, just delete the .setupfinished file and run this script again."
exit