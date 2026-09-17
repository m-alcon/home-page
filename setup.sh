#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="$SCRIPT_DIR/data"
SYSINFO_SCRIPT="$SCRIPT_DIR/scripts/sysinfo.sh"
CRON_LINE="*/5 * * * * $SYSINFO_SCRIPT"

echo "================================"
echo "  Home Dashboard Setup"
echo "================================"
echo ""

# 1. Install Docker if missing
if ! command -v docker &>/dev/null; then
    echo "[1/4] Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker "$USER"
    echo "      Docker installed. You may need to log out and back in."
    echo "      Trying with sudo for now..."
    DOCKER_CMD="sudo docker"
else
    echo "[1/4] Docker already installed."
    DOCKER_CMD="docker"
fi

# 2. Build and start container
echo "[2/4] Building and starting container..."
cd "$SCRIPT_DIR"
$DOCKER_CMD compose up -d --build

# 3. Create data directory if missing
mkdir -p "$DATA_DIR"

# 4. Set up cron job
echo "[3/4] Setting up cron job for system info..."
chmod +x "$SYSINFO_SCRIPT"

# Remove existing entry if present, then add
(crontab -l 2>/dev/null | grep -v "$SYSINFO_SCRIPT" ; echo "$CRON_LINE") | crontab -
echo "      Cron job added: $CRON_LINE"

# 5. Test sysinfo
echo "[4/4] Running system info script..."
bash "$SYSINFO_SCRIPT"
if [ -f "$DATA_DIR/sysinfo.json" ]; then
    echo "      System info OK"
else
    echo "      Warning: sysinfo.json not created. Check scripts/sysinfo.sh"
fi

# Get IP
PI_IP=$(hostname -I | awk '{print $1}')

echo ""
echo "================================"
echo "  Setup complete!"
echo "================================"
echo ""
echo "  Dashboard: http://$PI_IP:8080/"
echo ""
echo "  Optional: Add 'home.lan' in Pi-hole Local DNS"
echo "  to use http://home.lan:8080/ instead"
echo ""
