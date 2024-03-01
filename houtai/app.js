const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const { log } = require("console");
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // other CORS headers...
  next();
});

const port = 3002;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: 'clipboard'
});
con.connect(function (err) {
  if (err) throw err;
  console.log("数据库连接成功");
});
//封装创建数据库 传递一个id 和一个返回值
function createClipboard(id, res) {
  const sql = `INSERT INTO clipboard (id) VALUES ('${id}')`
  con.query(sql, (err, result) => {
    if (err) {
      console.log('创建失败' + err);
      res.json({
        status: 500,
        message: "创建失败"
      })
      return false
    }
    return true
  })
}

// 创建数据库
app.post('/createClipboard', (req, res) => {
  const { id } = req.body
  console.log('创建一个剪贴板中索引是' + id);
  res.json({
    status: 200,
    message: "剪贴板创建成功"
  })
})
// 插入一个上下文
app.post('/insertContent', (req, res) => {
  const { id, content } = req.body
  console.log('正在插入上下文')
  // 用户插入一个上下文
  const insertSql = `UPDATE clipboard SET content = '${content}' WHERE id = '${id}'`
  con.query(insertSql, (err, result) => {
    if (err) {
      console.log('查询上下文出错' + err)
      res.json({
        status: 500,
        message: '查询上下文出错'
      })
      return
    }
    console.log('ok!插入数据成功');
    res.json({
      status: 200,
      message: '文本保存成功',
    })
  })
})
// 获取剪贴板数据
app.post('/getClipboard', (req, res) => {
  const { id } = req.body;
  console.log('请求剪贴板' + id);
  const checkExistenceQuery = `SELECT * FROM clipboard WHERE id = '${id}'`;

  con.query(checkExistenceQuery, (error, results, fields) => {
    if (error) {
      console.log('数据库查询错误', error);
      res.json({
        status: 500,
        message: '数据库查询错误'
      });
      return;
    }

    if (results.length === 0) {
      console.log('没有这个索引正在创建');
      createClipboard(id, res);

    }

    // 更新数据库剪贴板的查看次数
    const updateSql = `UPDATE clipboard SET count = count + 1 WHERE id = '${id}'`;
    con.query(updateSql, (err, result) => {
      if (err) {
        console.log('添加查看次数错误', err);
        res.json({
          status: 500,
          message: '查看次数添加失败'
        });
        return; // 提前结束函数执行
      }

      const selectSql = `SELECT * FROM clipboard WHERE id = ?`;
      con.query(selectSql, [id], (err, result) => {
        if (err) {
          console.log('获取失败', err);
          res.json({
            status: 500,
            message: '获取数据失败'
          });
          return; // 提前结束函数执行
        }

        console.log('ok!正在返回剪贴板数据');
        res.json({
          status: 200,
          message: '成功获取到剪贴板数据',
          data: result
        });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`运行成功正在监听端口 ${port}`);
});
