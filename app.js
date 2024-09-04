// import http from 'http';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
//
// // ESモジュール形式で__dirnameを再定義
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//
// const server = http.createServer((req, res) => {
//   if (req.url === '/') {
//     const filePath = path.join(__dirname, 'index.html');
//
//     fs.readFile(filePath, (err, content) => {
//       if (err) {
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.write('Internal Server Error');
//         res.end();
//       } else {
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.write(content);
//         res.end();
//       }
//     });
//   } else {
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.write('404 Not Found');
//     res.end();
//   }
// });
//
// server.listen(8080, '127.0.0.1', () => {
//   console.log('Server is listening on http://127.0.0.1:8080');
// });

import express from 'express';
import pg from 'pg';
const { Pool } = pg;
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Expressアプリケーション(=サーバー)を作成
const app = express();
// reqのbodyをJSON形式からJSオブジェクトに変換するミドルウェア
app.use(express.json());

// 複数のデータベース接続を効率的に管理するためのクラス
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ESモジュール形式で__dirnameを再定義
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODOリストを取得
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos');
    const todos = result.rows;
    res.render('index', { todos });
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.sendStatus(500);
  }
});

// 新しいTODOを追加
app.post('/', async (req, res) => {
  try {
    const { task } = req.body; // フロントエンドから送られてきたタスクを取得
    console.log(task);

    // taskが空の場合、エラーを返す
    if (!task || task.trim() === '') {
      return res.status(400).json({ error: 'Task cannot be empty' });
    }

    // データベースにタスクを保存
    const result = await pool.query(
      'INSERT INTO todos (task) VALUES ($1) RETURNING *',
      [task],
    );

    // 挿入したレコードを返す
    res.status(201).json(result.rows[0]); // 201 Created を返す
  } catch (err) {
    console.error('Error inserting todo:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

// TODOのステータスを更新
app.post('/update', async (req, res) => {
  try {
    const { id, completed } = req.body;
    const result = await pool.query(
      'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// サーバーを起動
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
