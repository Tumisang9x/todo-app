const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Array to hold the todo items (in-memory storage)
let todoList = [];

// Route to render the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to get all todo items
app.get('/todos', (req, res) => {
  res.json(todoList);
});

// Route to add a new todo item
app.post('/add', (req, res) => {
  const task = req.body.task;
  if (task) {
    todoList.push({ task, id: Date.now() });
  }
  res.redirect('/');
});

// Route to delete a todo item
app.post('/delete', (req, res) => {
  const id = req.body.id;
  todoList = todoList.filter(todo => todo.id != id);
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
