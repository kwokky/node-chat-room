# node-chat-room

使用nodejs+socket.io实现的聊天室Demo



## 效果图

![效果图](https://s1.ax1x.com/2020/05/26/tPwJER.gif)



## 技术栈

- Node.js

- Express

- Socket.IO

- Vue

- Element-UI

  


## 运行

这个项目使用 [node](http://nodejs.org) 和 [npm](https://npmjs.com)。请确保本地安装了它们。

```bash
$ git clone https://github.com/gky1998/node-chat-room.git
$ cd node-chat-room
$ npm install
$ npm run dev
```

打开 http://localhost:3000 查看



## 服务器部署

[forever](https://github.com/foreversd/forever) 是一个Node启动器，可以让Node服务以守护进程的方式运行

```bash
# 全局安装forever
$ npm install -g forever

# 进入项目路径
$ cd /path/to/your/chat-room

# 启动服务
$ forever start ./app.js
```



修改nginx配置

```vim
server {
......

  location /room/ { # 当访问/room时，代理到Node服务，可以根据自己想定义的路径来
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
    rewrite            "^/room/(.*)$" /$1 break; # 这里正则也根据上面定义的路径来匹配
    proxy_pass         http://127.0.0.1:3000;  # Node服务默认运行在3000端口
  }
 
 ......
}
```



修改`www/js/chat-room.js` 1-3行

```js
// 修改前
// const hostname = window.location.hostname;
// const socket = io(`ws://${hostname}`, {path: '/room/socket.io'}); // 服务器部署路径
const socket = io(`ws://127.0.0.1:3000`,);

// 修改后
const hostname = window.location.hostname;
const socket = io(`ws://${hostname}`, {path: '/room/socket.io'}); // room就是nginx代理的路径，根据自己的来
// const socket = io(`ws://127.0.0.1:3000`,);
```


打开 http://example.com/room 查看



## 示例

演示地址：http://guoky.com/room
