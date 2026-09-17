const Weather = (() => {
    const LAT = 41.49;
    const LON = 2.19;
    const CONTAINER_ID = 'weather-content';

    const WMO_CODES = {
        0: { desc: 'Clear sky', icon: '\u2600' },
        1: { desc: 'Mainly clear', icon: '\u2600' },
        2: { desc: 'Partly cloudy', icon: '\u26c5' },
        3: { desc: 'Overcast', icon: '\u2601' },
        45: { desc: 'Fog', icon: '\ud83c\udf2b' },
        48: { desc: 'Depositing rime fog', icon: '\ud83c\udf2b' },
        51: { desc: 'Light drizzle', icon: '\ud83c\udf26' },
        53: { desc: 'Moderate drizzle', icon: '\ud83c\udf26' },
        55: { desc: 'Dense drizzle', icon: '\ud83c\udf27' },
        61: { desc: 'Slight rain', icon: '\ud83c\udf27' },
        63: { desc: 'Moderate rain', icon: '\ud83c\udf27' },
        65: { desc: 'Heavy rain', icon: '\ud83c\udf27' },
        66: { desc: 'Light freezing rain', icon: '\ud83c\udf28' },
        67: { desc: 'Heavy freezing rain', icon: '\ud83c\udf28' },
        71: { desc: 'Slight snow', icon: '\ud83c\udf28' },
        73: { desc: 'Moderate snow', icon: '\u2744' },
        75: { desc: 'Heavy snow', icon: '\u2744' },
        77: { desc: 'Snow grains', icon: '\u2744' },
        80: { desc: 'Slight rain showers', icon: '\ud83c\udf26' },
        81: { desc: 'Moderate rain showers', icon: '\ud83c\udf27' },
        82: { desc: 'Violent rain showers', icon: '\ud83c\udf27' },
        85: { desc: 'Slight snow showers', icon: '\u2744' },
        86: { desc: 'Heavy snow showers', icon: '\u2744' },
        95: { desc: 'Thunderstorm', icon: '\u26c8' },
        96: { desc: 'Thunderstorm with hail', icon: '\u26c8' },
        99: { desc: 'Thunderstorm with heavy hail', icon: '\u26c8' }
    };

    async function fetchWeather() {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) return;

        try {
            const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON +
                '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Europe/Madrid';
            const res = await fetch(url);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            const c = data.current;
            const wmo = WMO_CODES[c.weather_code] || { desc: 'Unknown', icon: '\u2753' };

            container.innerHTML =
                '<div class="weather-compact">' +
                    '<span class="weather-icon">' + wmo.icon + '</span>' +
                    '<span class="weather-temp">' + Math.round(c.temperature_2m) + '\u00b0C</span>' +
                    '<span class="weather-desc">' + wmo.desc + '</span>' +
                    '<span class="weather-detail">\ud83d\udca7 ' + c.relative_humidity_2m + '%</span>' +
                '</div>';
        } catch (e) {
            container.innerHTML = '<span class="weather-error">Could not load weather</span>';
        }
    }

    function init() {
        fetchWeather();
        setInterval(fetchWeather, 15 * 60 * 1000);
    }

    return { init };
})();
