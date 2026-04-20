#!/bin/bash
set -e

REPO_URL="https://github.com/ucmo-cs/S26_SE3910_Team10.git"
BACKEND_BRANCH="feature/backend-api"
FRONTEND_BRANCH="feature/frontend-api-integration"
INSTALL_DIR="$HOME/appointments-app"
JAVA_HOME_PATH="/usr/lib/jvm/java-21-openjdk"
DB_NAME="appointments_db"
DB_USER="appointments"
DB_PASS="appointments123"

# ── 1. System packages ────────────────────────────────────────────────────────
echo ">>> Installing system packages"
sudo dnf install -y \
    git \
    java-21-openjdk \
    maven \
    nodejs \
    npm \
    mariadb-server

# ── 2. JAVA_HOME ──────────────────────────────────────────────────────────────
echo ">>> Configuring JAVA_HOME"
export JAVA_HOME="$JAVA_HOME_PATH"
if ! grep -q "JAVA_HOME" ~/.bashrc; then
    echo "export JAVA_HOME=$JAVA_HOME_PATH" >> ~/.bashrc
fi

# ── 3. MariaDB ────────────────────────────────────────────────────────────────
echo ">>> Starting MariaDB"
sudo systemctl enable --now mariadb

echo ">>> Creating database and user"
sudo mariadb -e "
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
"

# ── 4. Clone repositories ─────────────────────────────────────────────────────
echo ">>> Cloning repositories into $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

if [ ! -d "$INSTALL_DIR/backend" ]; then
    git clone -b "$BACKEND_BRANCH" "$REPO_URL" "$INSTALL_DIR/backend"
else
    echo "    Backend already cloned — skipping"
fi

if [ ! -d "$INSTALL_DIR/frontend" ]; then
    git clone -b "$FRONTEND_BRANCH" "$REPO_URL" "$INSTALL_DIR/frontend"
else
    echo "    Frontend already cloned — skipping"
fi

# ── 5. Frontend dependencies ──────────────────────────────────────────────────
echo ">>> Installing frontend dependencies"
cd "$INSTALL_DIR/frontend"
npm install

# ── 6. Backend smoke test ─────────────────────────────────────────────────────
echo ">>> Running backend tests"
cd "$INSTALL_DIR/backend"
JAVA_HOME="$JAVA_HOME_PATH" mvn clean test -q

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo "============================================"
echo "  Setup complete!"
echo "============================================"
echo ""
echo "Start the backend (terminal 1):"
echo "  cd $INSTALL_DIR/backend"
echo "  JAVA_HOME=$JAVA_HOME_PATH mvn spring-boot:run"
echo ""
echo "Start the frontend (terminal 2):"
echo "  cd $INSTALL_DIR/frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000"
