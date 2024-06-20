<script setup>
import { query, insert } from '@/api/content'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
defineOptions({
  name: 'ContentIndex'
})
// 页面获取剪贴板数据
const id = ref(route.params.id)
const createTime = ref(null)
const viewTimes = ref(null)
const content = ref(null)

onMounted(async () => {
  try {
    const res = await query(id.value)
    if (res.status === 200 && res.data) {
      createTime.value = res.data.created_at
      content.value = res.data.content
      viewTimes.value = res.data.count
    } else {
      console.error('Failed to fetch clipboard data:', res.message)
    }
  } catch (error) {
    console.error('Error fetching clipboard data:', error)
  }
})

// 剪贴板插入数据
const updateContent = async () => {
  try {
    await insert({
      id: route.params.id,
      content: content.value
    })
  } catch (error) {
    console.error('Error inserting content:', error)
  }
}
</script>

<template>
  <div class="app">
    <div id="nav">
      <ul>
        <li class="left">
          <a href="">INTERNET CLIPBOARD</a>
        </li>
        <p style="float: left; color: red">项目还不完善请你点击阅读完成之后点击清除按钮</p>
        <li class="juzhong" v-show="false">
          Lost time
          <select name="" id="">
            <option value="3">3分钟</option>
            <option value="5">5分钟</option>
            <option value="20">20分钟</option>
            <option value="1">1小时</option>
            <option value="7">7天</option>
            <option value="14">14天</option>
            <option value="30">30天</option>
          </select>
        </li>
        <li class="right">
          <button class="submit" @click="updateContent">
            <img src="../assets/正确.svg" alt="" />
          </button>
        </li>
        <li class="right">
          <input type="text" class="index" :value="route.params.id" />
        </li>
        <li class="right">Current index:</li>
      </ul>
    </div>
    <div id="mainBox">
      <div id="content">
        <textarea
          v-model="content"
          name=""
          id=""
          cols="96"
          rows="30"
          placeholder=" 
                可以随便记录点什么，单次支持28万字符。.
                剪贴板只要有效期内有查看或修改则永不过期，将自动延期所设置有效期时长
                使用后请主动删除剪贴板，避免数据长时间存储造成数据泄露。"
        ></textarea>
      </div>
      <div id="tools">
        <div class="copy-box">
          <button class="copy-button">
            <img src="../assets/复制文件.svg" alt="" />
          </button>
        </div>
        <div class="download-box">
          <button class="download-button">
            <img src="../assets/下载.svg" alt="" />
          </button>
        </div>
        <br>
        <div class="copy-box">
          <button class="copy-button">
            <img src="../assets/复制文件.svg" alt="" />
          </button>
        </div>
        <div>
          <ul class="time">
            <li>创建时间</li>
            <li>{{ createTime }}</li>
            <li>查看次数</li>
            <li>{{ viewTimes }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div id="bottom">
      <p>THE INTERNET CLIPBOARD FROM LUOZIHAO</p>
    </div>
  </div>
</template>

<style scoped>
/* 重置默认的边距、内边距、盒模型、字体 */
* {
  margin: 0;
  /* 边距为0 */
  padding: 0;
  /* 内边距为0 */
  box-sizing: border-box;
  /* 使用边框盒模型 */
  font-family: 'MyCustomFont', sans-serif;
  /* 使用微软雅黑字体 */
}

div,
span,
p {
  caret-color: transparent;
}

@font-face {
  font-family: 'MyCustomFont';
  src: url('../assets/font/UNSII-2.ttf') format('truetype');
  /* 替换为正确的路径 */
  /* 可以添加更多的格式和变体（如果有的话） */
}

/* 去除默认列表样式 */
li {
  list-style: none;
  /* 不显示列表样式 */
}

/* 头部 */
#nav {
  width: 100%;
  /* 宽度100% */
  height: 50px;
  /* 高度50像素 */
  padding: 5px;
  /* 内边距为13像素 */
  padding-left: 58px;
  /* 左侧内边距为58像素 */
  padding-right: 20px;
  box-shadow: 0.1px 0.1px 5px 1px #666666;
  /* 设置阴影 */
  background: url(../assets/清单.svg) no-repeat 20px center;
  /* 设置背景图片 */
}

/* 垂直居中导航项 */
ul {
  align-items: center;
  /* 垂直居中 */
  align-self: center;
  /* 子元素垂直居中 */
}

/* 左对齐导航链接样式 */
#nav .left a {
  font-size: 18px;
  /* 字体大小18像素 */
  color: #3f72af;
  /* 文本颜色 */
  text-decoration: none;
  /* 去除下划线 */
  float: left;
  /* 左浮动 */
}

#nav .left a {
  font-size: 18px;
  /* 字体大小18像素 */
  color: #3f72af;
  /* 文本颜色 */
  text-decoration: none;
  /* 去除下划线 */
  float: left;
  /* 左浮动 */
}

/* 右对齐导航链接样式 */
#nav .right {
  font-size: 18px;
  /* 字体大小18像素 */
  color: #3f72af;
  /* 文本颜色 */
  text-decoration: none;
  /* 去除下划线 */
  float: right;
  /* 右浮动 */
  margin-left: 20px;
}

.index {
  border: #3f72af 3px solid;
  border-radius: 50px;
  text-align: center;
  outline: none;
}

.juzhong {
  font-size: 18px;
  color: #3f72af;
  width: 200px;
  margin-left: 50px;
  line-height: 40px;
  float: left;
}

/* 时间 */
select {
  border-radius: 30px;
  border: #3f72af 3px solid;
  text-align: center;
  color: #3f72af;
  font-family: '微软雅黑';
  outline: none;
}

.submit {
  width: 60px;
  height: 40px;
  border: 3px #3f72af solid;
  border-radius: 30px;
  background: none;
  color: #3f72af;
  line-height: 25px;
  transition: 0.1s;
  line-height: 5px;
}

#mainBox {
  width: 1260px;
  margin: 0 auto;
}

/* 内容 */
#content {
  width: 960px;
  height: 800px;
  border: #3f72af solid 2px;
  margin-top: 5px;
  float: left;
}

/* 文本域样式 */
#content textarea {
  width: 950px;
  height: 790px;
  border: none;
  resize: none;
  border: solid 0px;
  outline: none;
  font-size: 16px;
  font-family: '微软雅黑';
  caret-color: black;
  padding: 50px;
}

#tools {
  margin-top: 5px;
  width: 300px;
  height: 800px;
  border: #3f72af 2px solid;
  float: left;
  padding: 10px;
  border-left: none;
}

.copy-box {
  width: 100px;
  height: 60px;
  margin: 0 auto;
  margin-bottom: 50px;
}

.download-box {
  width: 100px;
  height: 60px;
  margin: 0 auto;
}

.copy-button {
  width: 100px;
  height: 50px;
  border: 3px solid #3f72af;
  background: none;
  border-radius: 50px;
  line-height: 65px;
  transition: 0.1s;
}

.download-button {
  width: 100px;
  height: 50px;
  border: 3px solid #3f72af;
  background: none;
  border-radius: 50px;
  line-height: 65px;
  transition: 0.1s;
}

.download-button:hover {
  border: 5px #3f72af solid;
}

.copy-button:hover {
  border: 5px #3f72af solid;
}

.submit:hover {
  border: #3f72af 5px solid;
}

.time {
  margin-top: 50px;
  border: #3f72af solid 1px;
  padding: 10px;
  border-radius: 10px;
  color: #3f72af;
}

.time li {
  width: 300px;
  height: 50px;
  font-size: 18px;
}

/* 底部导航栏 */
#bottom {
  width: 100%;
  height: 50px;
  position: absolute;
  top: 94%;
  box-shadow: 0.1px 0.1px 5px 1px #666666;
  /* 设置阴影 */
  text-align: center;
  color: #3f72af;
  line-height: 50px;
  background-color: rgb(255, 255, 255, 0.9);
}
</style>
