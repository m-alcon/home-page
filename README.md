# Home Dashboard

A lightweight homepage for Raspberry Pi with shared notes and to-do lists, running in Docker alongside Pi-hole.

## Features

- **Clock & Date** — live updating
- **Weather** — current conditions for Montcada i Reixac (Open-Meteo, no API key)
- **System Info** — CPU temp, RAM, disk, uptime (via host cron)
- **Pi-hole Link** — quick access to admin panel
- **Notes** — colored sticky notes, shared across all devices
- **To-Do List** — tasks with checkboxes, shared across all devices

## Requirements

- Raspberry Pi with Docker installed
- Pi-hole running on port 80

## Quick Start

```bash
git clone <repo-url> homepage
cd homepage
docker-compose up -d
```

Dashboard is now at `http://<pi-ip>:8080/`

## Setup

### 1. Install Docker (if not already installed)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

Log out and back in for the group change to take effect.

### 2. Clone and start

```bash
git clone <repo-url> homepage
cd homepage
docker-compose up -d
```

That's it. The container builds automatically on first run.

### 3. Access

```
http://<pi-ip>:8080/
```

### 4. (Optional) Local domain name

Add a DNS record in Pi-hole:

1. Go to **Pi-hole Admin** → **Local DNS** → **DNS Records**
2. Add: `home.lan` → your Pi's IP
3. Access at `http://home.lan:8080/`

### 5. (Optional) System info widget

The system info widget needs data from the host. Add a cron job:

```bash
crontab -e
```

Add:

```
*/5 * * * * /home/$USER/homepage/scripts/sysinfo.sh
```

Update the script output path if your clone directory is different.

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
└── supervisord.conf
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

Then restart: `docker-compose up -d`

## Common Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check container status
docker-compose ps
```

## Troubleshooting

**Port already in use?**
Check what's using it:
```bash
sudo ss -tlnp | grep :8080
```

**Container won't start?**
Check logs:
```bash
docker-compose logs
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
