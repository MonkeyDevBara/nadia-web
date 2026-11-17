#!/usr/bin/env bash
# Deploy ke VPS (gear2): sinkron source -> build di server -> restart service.
# Pemakaian: ./scripts/deploy.sh
# Prasyarat: akses SSH `gear2`, file /var/www/html/nadia-web/.env.production sudah ada di server.
set -euo pipefail

HOST="${DEPLOY_HOST:-gear2}"
DIR="${DEPLOY_DIR:-/var/www/html/nadia-web}"

cd "$(dirname "$0")/.."

echo "==> Sinkron source ke $HOST:$DIR"
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude '.env*' --exclude tsconfig.tsbuildinfo \
  ./ "$HOST:$DIR/"

echo "==> Build di server"
ssh "$HOST" "cd $DIR && export NODE_OPTIONS=--max-old-space-size=1536 \
  && nice -n 10 npm ci --no-audit --no-fund >/dev/null \
  && nice -n 10 npm run build \
  && chown -R www-data:www-data $DIR \
  && systemctl restart nadia-web \
  && sleep 3 && systemctl is-active nadia-web"

echo "==> Selesai"
