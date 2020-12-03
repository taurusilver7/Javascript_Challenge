

const form = document.getElementById('form');
const input = document.getElementById('input');
const todosUl = document.getElementById('todos');

const todos = JSON.parse(localStorage.getItem('todos'));

if(todos) {
    todos.forEach(todo => {
        addToDo(todo);
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    addToDo();
   
});

function addToDo(todo) {
    let todoText = input.value;

    if(todo) {
        todoText = todo.text;
    }

    if(todoText) {
        const todoEl = document.createElement('li');

        if (todo && todo.completed) {
            todoEl.classList.add('completed');
        }

        todoEl.innerText = todoText;

        todoEl.addEventListener('click', () => {
            todoEl.classList.toggle('completed');
            updateLS();

        });

        todoEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            todoEl.remove();// delete the input on right click.
            updateLS();

        });

        // add the todo data to the list.
        todosUl.appendChild(todoEl);

        // Empty the placeholder position for a new input
        input.value = '';

        updateLS();// update local storage

    }
};

function updateLS() {
    const todosEl = document.querySelectorAll('li');

    const todos = [];

    todosEl.forEach(todoEl => {
        todos.push({
            text: todoEl.innerText,
            completed:todoEl.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}