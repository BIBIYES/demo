# 互联网剪贴板使用方法
当前版本1.0

# 部署
在自己的服务器部署你需要修改配置才可以使用

## 修改前端地址
**修改请求地址**
```js
export const request = axios.create({
  baseURL: 'http://127.0.0.1:3000',  // 添加协议部分
  timeout: 5000,
});
```
你需要将`baseURL`中的链接替换成你的服务端地址
你可以在`src\utils\request.js`找到
**修改后端服务地址**
```js
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: 'clipboard'
});
```
你需要将`host`设置成你的mysql服务地址
配置`user``password`为你的mysql用户名和密码
**创建数据库和表**
你需要在mysql中执行一下命令来创建一个数据库和表
-- First, select the database or create it if it doesn't exist
CREATE DATABASE IF NOT EXISTS `clipboard`;

-- Switch to the selected database
USE `clipboard`;

-- Now create the table within the selected database
CREATE TABLE IF NOT EXISTS `clipboard` (
  `id` varchar(255) DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `count` int DEFAULT '0',
  `last_viewed_at` timestamp NULL DEFAULT NULL
);
