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

// TODOリストを取得
app.get('/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos');
  res.json(result.rows);
});

// 新しいTODOを追加
app.post('/todos', async (req, res) => {
  const { task } = req.body;
  const result = await pool.query(
    'INSERT INTO todos (task) VALUES ($1) RETURNING *',
    [task],
  );
  res.json(result.rows[0]);
});

// サーバーを起動
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
