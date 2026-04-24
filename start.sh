#!/bin/bash
set -e

INSTALL_DIR="$(cd "$(dirname "$0")" && pwd)"
JAVA_HOME="/usr/lib/jvm/java-21-openjdk"

echo ">>> Starting MariaDB"
sudo systemctl start mariadb

echo ">>> Starting backend"
cd "$INSTALL_DIR/backend"
JAVA_HOME="$JAVA_HOME" mvn spring-boot:run -q &
BACKEND_PID=$!

echo ">>> Starting frontend"
cd "$INSTALL_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
