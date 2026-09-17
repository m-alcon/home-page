const Todo = (() => {
    const API_URL = 'api/todos.php';
    let todos = [];

    async function load() {
        try {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            todos = await res.json();
        } catch (e) {
            todos = [];
        }
    }

    function save() {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todos)
        });
    }

    function render() {
        const list = document.getElementById('todo-list');
        const countEl = document.getElementById('todo-count');
        if (!list) return;

        list.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.done;
            checkbox.addEventListener('change', () => {
                todo.done = checkbox.checked;
                save();
                render();
            });

            const text = document.createElement('span');
            text.className = 'todo-text' + (todo.done ? ' done' : '');
            text.textContent = todo.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'todo-delete';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Delete';
            deleteBtn.addEventListener('click', () => {
                const idx = todos.findIndex(t => t.id === todo.id);
                if (idx !== -1) {
                    todos.splice(idx, 1);
                    save();
                    render();
                }
            });

            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });

        const remaining = todos.filter(t => !t.done).length;
        if (countEl) {
            countEl.textContent = remaining + ' task' + (remaining !== 1 ? 's' : '') + ' left';
        }
    }

    function addTodo() {
        const input = document.getElementById('todo-input');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        todos.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
            text: text,
            done: false
        });
        save();
        input.value = '';
        render();
    }

    function clearCompleted() {
        todos = todos.filter(t => !t.done);
        save();
        render();
    }

    async function init() {
        await load();
        render();

        const addBtn = document.getElementById('add-todo-btn');
        const input = document.getElementById('todo-input');
        const clearBtn = document.getElementById('clear-completed-btn');

        if (addBtn) addBtn.addEventListener('click', addTodo);
        if (input) input.addEventListener('keydown', e => {
            if (e.key === 'Enter') addTodo();
        });
        if (clearBtn) clearBtn.addEventListener('click', clearCompleted);
    }

    return { init };
})();
