<h1 align="center"><a href="https://gitee.com/kuzan/snails-web">snails-web</a></h1>
一个基于 Spring-Boot + Angular + Ng-Zorro 前后端分离项目的简单实现

- [snails 框架](https://gitee.com/kuzan/snails)：编程入门，新手礼赞
- [snails-web 前端](https://gitee.com/kuzan/snails-web)：Angular + Ng-Zorro + Ng-Alain
- [snails-api 后台](https://gitee.com/kuzan/snails-api)：Sprint-Boot + JPA + lombok + Java8 + Mysql

## 开发环境要求
- [Node](https://nodejs.org/zh-cn/)
- [yarn](https://yarn.bootcss.com/)
- [启动 snails-api 后台服务](https://gitee.com/kuzan/snails-api)

项目数据来源于[snails-api](https://gitee.com/kuzan/snails-api)，因此需要获取并启动此工程

## 获取项目

```shell
git clone https://gitee.com/kuzan/snails-web.git snails-web
cd snails-web
yarn   # yarn 安装项目的依赖，或者使用 npm install 也可
```

### 1.3 启动项目 - 方法1
```shell
npm run start
```

### 1.3 启动项目 - 方法2
前提：系统已安装 docker
```shell
# 打包为 docker 镜像
docker build -t snails-web .
# 启动程序
docker run -d --name snails-web -p 4200:4200 snails-web
# 查看运行中的 docker 实例
docker ps -a 
```

浏览器访问 http://localhost:4200/

确保[snails-api](https://gitee.com/kuzan/snails-api)服务正常启动，输入 【账号】kuzank 【密码】123456

登陆页面
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9bm9jpej31cq0u079f.jpg)

首页
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gb31ak9yfqj31h20u047a.jpg)

用户管理
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9drj5xjj31ck0u00y9.jpg)

组织管理
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9e8m16nj31cn0u0grh.jpg)

菜单管理
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9etun63j31cr0u07aq.jpg)

在线用户
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9fj317qj31cu0u00yf.jpg)

登陆日志
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9g2nz92j31cn0u017t.jpg)

http请求
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9gmcmiaj31cp0u0n8p.jpg)

系统异常
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9h9q1vzj31cm0u0qa5.jpg)

G2图表
![](https://tva1.sinaimg.cn/large/006tNbRwgy1gay9hwyfesj31ct0u0q9m.jpg)

## 学习资源
- [Angular快速上手](https://angular.cn/guide/quickstart)
- [Ng-Zorro](https://ng.ant.design/docs/introduce/zh)
- [Ng-Alain](https://ng-alain.com/)


## 开源许可证
MIT
