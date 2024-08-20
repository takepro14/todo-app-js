const apiUrl = 'http://localhost:3000/api/todos';

function fetchTodos() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const todoList = document.getElementById('todo-list');
      todoList.innerHTML = '';
      data.todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
                    <span>${todo.task}</span>
                    <div>
                        <button onclick="toggleComplete(${todo.id}, ${todo.completed})">
                            ${todo.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button onclick="deleteTodo(${todo.id})">Delete</button>
                    </div>
                `;
        todoList.appendChild(li);
      });
    });
}

function addTodo() {
  const newTodo = document.getElementById('new-todo').value;
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task: newTodo }),
  }).then(() => {
    document.getElementById('new-todo').value = '';
    fetchTodos();
  });
}

function toggleComplete(id, completed) {
  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed: !completed }),
  }).then(() => fetchTodos());
}

function deleteTodo(id) {
  fetch(`${apiUrl}/${id}`, { method: 'DELETE' }).then(() => fetchTodos());
}

fetchTodos();
