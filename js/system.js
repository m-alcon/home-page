const System = (() => {
    const CONTAINER_ID = 'system-content';
    const DATA_URL = 'data/sysinfo.json';

    function formatUptime(seconds) {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (d > 0) return d + 'd ' + h + 'h';
        if (h > 0) return h + 'h ' + m + 'm';
        return m + 'm';
    }

    function barClass(pct) {
        if (pct >= 90) return 'crit';
        if (pct >= 75) return 'warn';
        return '';
    }

    async function fetchSystem() {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) return;

        try {
            const res = await fetch(DATA_URL + '?t=' + Date.now());
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const d = await res.json();

            const memPct = d.mem_total > 0 ? Math.round((d.mem_used / d.mem_total) * 100) : 0;
            const diskPct = d.disk_total > 0 ? Math.round((d.disk_used / d.disk_total) * 100) : 0;

            container.innerHTML =
                '<div class="system-compact">' +
                    '<div class="system-item-compact">' +
                        '<span class="system-label">CPU</span>' +
                        '<span class="system-value">' + d.cpu_temp + '\u00b0C</span>' +
                    '</div>' +
                    '<div class="system-item-compact">' +
                        '<span class="system-label">RAM</span>' +
                        '<span class="system-value">' + memPct + '%</span>' +
                        '<div class="system-bar"><div class="system-bar-fill ' + barClass(memPct) + '" style="width:' + memPct + '%"></div></div>' +
                    '</div>' +
                    '<div class="system-item-compact">' +
                        '<span class="system-label">Disk</span>' +
                        '<span class="system-value">' + diskPct + '%</span>' +
                        '<div class="system-bar"><div class="system-bar-fill ' + barClass(diskPct) + '" style="width:' + diskPct + '%"></div></div>' +
                    '</div>' +
                '</div>';
        } catch (e) {
            container.innerHTML = '<span class="system-error">No system data yet</span>';
        }
    }

    function init() {
        fetchSystem();
        setInterval(fetchSystem, 5 * 60 * 1000);
    }

    return { init };
})();
