const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log } = require('console');

const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // other CORS headers...
  next();
});

// Create and connect to SQLite database
const db = new sqlite3.Database('./clipboard.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS clipboard (
    id TEXT PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP DEFAULT NULL
  )
`);

// Function to create a clipboard
function createClipboard(id, res) {
  const sql = `INSERT INTO clipboard (id) VALUES (?)`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.log('创建失败' + err);
      res.json({
        status: 500,
        message: "创建失败"
      });
      return false;
    }
    return true;
  });
}

// Create clipboard endpoint
app.post('/createClipboard', (req, res) => {
  const { id } = req.body;
  console.log('创建一个剪贴板中索引是' + id);
  createClipboard(id, res);
  res.json({
    status: 200,
    message: "剪贴板创建成功"
  });
});

// Insert content endpoint
app.post('/insertContent', (req, res) => {
  const { id, content } = req.body;
  console.log('正在插入上下文');
  const insertSql = `UPDATE clipboard SET content = ?, last_viewed_at = CURRENT_TIMESTAMP WHERE id = ?`;
  db.run(insertSql, [content, id], function (err) {
    if (err) {
      console.log('查询上下文出错' + err);
      res.json({
        status: 500,
        message: '查询上下文出错'
      });
      return;
    }
    console.log('ok!插入数据成功');
    res.json({
      status: 200,
      message: '文本保存成功',
    });
  });
});

// Get clipboard data endpoint
app.post('/getClipboard', (req, res) => {
  const { id } = req.body;
  console.log('请求剪贴板' + id);
  const checkExistenceQuery = `SELECT * FROM clipboard WHERE id = ?`;

  db.get(checkExistenceQuery, [id], (error, row) => {
    if (error) {
      console.log('数据库查询错误', error);
      res.json({
        status: 500,
        message: '数据库查询错误'
      });
      return;
    }

    if (!row) {
      console.log('没有这个索引正在创建');
      createClipboard(id, res);
    } else {
      // 更新数据库剪贴板的查看次数
      const updateSql = `UPDATE clipboard SET count = count + 1, last_viewed_at = CURRENT_TIMESTAMP WHERE id = ?`;
      db.run(updateSql, [id], function (err) {
        if (err) {
          console.log('添加查看次数错误', err);
          res.json({
            status: 500,
            message: '查看次数添加失败'
          });
          return;
        }

        res.json({
          status: 200,
          message: '成功获取到剪贴板数据',
          data: row
        });
      });
    }
  });
});


app.listen(port, () => {
  console.log(`运行成功正在监听端口 ${port}`);
});
