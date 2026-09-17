#!/bin/bash
# System info collector for Raspberry Pi
# Run via cron: */5 * * * * /var/www/html/homepage/scripts/sysinfo.sh

OUT="/var/www/html/homepage/data/sysinfo.json"

mkdir -p "$(dirname "$OUT")"

# CPU temperature (Raspberry Pi)
cpu_temp=$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null)
if [ -n "$cpu_temp" ]; then
    cpu_temp=$(awk "BEGIN {printf \"%.1f\", $cpu_temp / 1000}")
else
    cpu_temp="N/A"
fi

# Uptime in seconds
uptime_sec=$(awk '{print int($1)}' /proc/uptime)

# Memory
mem_info=$(free -b | awk '/^Mem:/ {print $2, $3}')
mem_total=$(echo "$mem_info" | awk '{print $1}')
mem_used=$(echo "$mem_info" | awk '{print $2}')

# Disk usage for root filesystem
disk_info=$(df -B1 / | awk 'NR==2 {print $2, $3}')
disk_total=$(echo "$disk_info" | awk '{print $1}')
disk_used=$(echo "$disk_info" | awk '{print $2}')

cat > "$OUT" <<EOF
{
  "cpu_temp": $cpu_temp,
  "uptime": $uptime_sec,
  "mem_total": $mem_total,
  "mem_used": $mem_used,
  "disk_total": $disk_total,
  "disk_used": $disk_used,
  "updated": $(date +%s)
}
EOF

chmod 644 "$OUT"
