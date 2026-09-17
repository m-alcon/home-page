const Clock = (() => {
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function update() {
        const now = new Date();
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');

        if (timeEl) {
            timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
        }
        if (dateEl) {
            dateEl.textContent = DAYS[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();
        }
    }

    function init() {
        update();
        setInterval(update, 1000);
    }

    return { init };
})();
