# Home Dashboard

A lightweight homepage for Raspberry Pi with shared notes and to-do lists, running in Docker alongside Pi-hole.

## Features

- **Top Bar** — Pi-hole link (left), system stats with progress bars (right)
- **Info Strip** — clock + date (left), weather (right)
- **Notes** — colored sticky notes, shared across all devices
- **To-Do List** — tasks with checkboxes, shared across all devices

## Requirements

- Raspberry Pi with Raspberry Pi OS
- Pi-hole running on port 80

## Quick Start

```bash
git clone <repo-url> homepage
cd homepage
chmod +x setup.sh
./setup.sh
```

The script will:
1. Install Docker if missing
2. Build and start the container
3. Set up the cron job for system info
4. Print the dashboard URL

Done. Open `http://<pi-ip>:8080/`

## Manual Setup

If you prefer to set up step by step:

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Log out and back in for the group change to take effect.

### 2. Start the container

```bash
docker compose up -d
```

### 3. Set up system info cron

```bash
crontab -e
# Add this line:
*/5 * * * * /home/$USER/homepage/scripts/sysinfo.sh
```

### 4. Access

```
http://<pi-ip>:8080/
```

## Optional: Local Domain Name

Add a DNS record in Pi-hole:

1. Go to **Pi-hole Admin** → **Local DNS** → **DNS Records**
2. Add: `home.lan` → your Pi's IP
3. Access at `http://home.lan:8080/`

## Project Structure

```
homepage/
├── index.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── clock.js
│   ├── weather.js
│   ├── system.js
│   ├── notes.js
│   └── todo.js
├── api/
│   ├── notes.php
│   └── todos.php
├── scripts/
│   └── sysinfo.sh
├── data/                  ← volume mount (persists notes/todos)
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── supervisord.conf
└── setup.sh               ← one-click setup
```

## Customization

### Weather location

Edit `js/weather.js` and change the `LAT` and `LON` constants. Find your coordinates at [latlong.net](https://www.latlong.net/).

### Port

Edit `docker-compose.yml` and change the port mapping:

```yaml
ports:
  - "8080:80"   # change 8080 to whatever you want
```

Then restart: `docker compose up -d`

## Common Commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Rebuild after code changes
docker compose up -d --build

# View logs
docker compose logs -f

# Check container status
docker compose ps
```

## Troubleshooting

**Port already in use?**
```bash
sudo ss -tlnp | grep :8080
```

**Container won't start?**
```bash
docker compose logs
```

**Notes/todos not saving?**
Check that `data/` is writable:
```bash
ls -la data/
```

**System info shows "No data yet"?**
Run the script manually:
```bash
bash scripts/sysinfo.sh
cat data/sysinfo.json
```
