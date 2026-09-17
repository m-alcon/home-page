document.addEventListener('DOMContentLoaded', () => {
    Clock.init();
    Weather.init();
    System.init();
    Notes.init();
    Todo.init();
});

document.getElementById('piholeLink').href = location.protocol + '//' + location.hostname + '/admin';
