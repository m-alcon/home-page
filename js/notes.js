const Notes = (() => {
    const STORAGE_KEY = 'dashboard_notes';
    const COLORS = ['yellow', 'green', 'blue', 'pink', 'orange'];

    function load() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function save(notes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    function createNote(text, color) {
        return {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            text: text || '',
            color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
            created: Date.now()
        };
    }

    function render() {
        const container = document.getElementById('notes-container');
        if (!container) return;

        const notes = load();
        container.innerHTML = '';

        notes.forEach(note => {
            const el = document.createElement('div');
            el.className = 'note note-' + note.color;
            el.dataset.id = note.id;

            const textarea = document.createElement('textarea');
            textarea.className = 'note-text';
            textarea.value = note.text;
            textarea.placeholder = 'Write something...';
            textarea.addEventListener('input', () => {
                note.text = textarea.value;
                save(notes);
            });

            const footer = document.createElement('div');
            footer.className = 'note-footer';

            const colorPicker = document.createElement('div');
            colorPicker.className = 'note-color';
            COLORS.forEach(c => {
                const dot = document.createElement('span');
                dot.className = 'note-color-dot' + (note.color === c ? ' active' : '');
                dot.style.background = colorVar(c);
                dot.addEventListener('click', () => {
                    note.color = c;
                    save(notes);
                    render();
                });
                colorPicker.appendChild(dot);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'note-delete';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Delete note';
            deleteBtn.addEventListener('click', () => {
                const idx = notes.findIndex(n => n.id === note.id);
                if (idx !== -1) {
                    notes.splice(idx, 1);
                    save(notes);
                    render();
                }
            });

            footer.appendChild(colorPicker);
            footer.appendChild(deleteBtn);
            el.appendChild(textarea);
            el.appendChild(footer);
            container.appendChild(el);
        });
    }

    function colorVar(name) {
        const map = {
            yellow: '#eab308',
            green: '#22c55e',
            blue: '#3b82f6',
            pink: '#ef4444',
            orange: '#f97316'
        };
        return map[name] || map.blue;
    }

    function addNote() {
        const notes = load();
        const note = createNote();
        notes.unshift(note);
        save(notes);
        render();
        const first = document.querySelector('.note-text');
        if (first) first.focus();
    }

    function init() {
        render();
        const btn = document.getElementById('add-note-btn');
        if (btn) btn.addEventListener('click', addNote);
    }

    return { init };
})();
