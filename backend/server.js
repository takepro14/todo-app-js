const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'todo_db',
});

// Routes
app.get('/api/todos', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM todos');
  res.json({ todos: rows });
});

app.post('/api/todos', async (req, res) => {
  const { task } = req.body;
  const [result] = await pool.query(
    'INSERT INTO todos (task, completed) VALUES (?, ?)',
    [task, 0],
  );
  res.json({ id: result.insertId });
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [
    completed,
    id,
  ]);
  res.json({ updated: true });
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM todos WHERE id = ?', [id]);
  res.json({ deleted: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
