set -ev

rm -rf build

node -v && npm ci && npx tsc

mkdir build
mv app build && cp package*.json build && cp .env build && cp Procfile build

echo "node_modules" > build/.gitignore
