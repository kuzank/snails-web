# snails-web
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/b_dashboard.jpg)

一个基于 Spring-Boot + Angular + Ng-Zorro 前后端分离项目的简单实现

- `Snails 框架`：编程入门，新手礼赞
- `snails-web 前端`：[Angular](https://angular.cn/) + [Ng-Zorro](https://ng.ant.design/docs/introduce/zh) + [Ng-Alain](https://ng-alain.com)
- `snails-api 后台`：[SpringBoot](https://spring.io/projects/spring-boot) + [JPA ](https://spring.io/guides/gs/accessing-data-jpa/)+ [lombok](https://projectlombok.org/) + [Java8](https://zhuanlan.zhihu.com/java8) + Mysql

|      `框架源码`     | Gitee                                                        | GitHub                                                       |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Snails** 框架      | [https://gitee.com/kuzan/snails](https://gitee.com/kuzan/snails) | [https://github.com/danxiaogui/snails](https://github.com/danxiaogui/snails) |
| **Snails-web** 前端  | [https://gitee.com/kuzan/snails-web](https://gitee.com/kuzan/snails-web) | [https://github.com/danxiaogui/snails-web](https://github.com/danxiaogui/snails-web) |
| **Snails-api**  后台 | [https://gitee.com/kuzan/snails-api](https://gitee.com/kuzan/snails-api) | [https://github.com/danxiaogui/snails-api](https://github.com/danxiaogui/snails-api) |


## 开发环境要求
- [Node](https://nodejs.org/zh-cn/)
- [yarn](https://yarn.bootcss.com/)
- **启动 snails-api 后台服务**
本前端项目 `snails-web` 的 `REST API` 数据来源于`snails-api`，因此需要获取并启动此工程

## 获取项目

```shell
git clone https://gitee.com/kuzan/snails-web.git snails-web
cd snails-web
yarn   # yarn 安装项目的依赖，或者使用 npm install 也可
```

### 启动项目 - 方法一
```shell
npm run start
```

### 启动项目 - 方法二
前提：系统已安装 `docker`
```shell
# 打包为 docker 镜像
docker build -t snails-web .
# 启动程序
docker run -d --name snails-web -p 4200:4200 snails-web
```

## 系统截图 
本前端项目 `snails-web` 的 `REST API` 数据来源于`snails-api`，因此需要获取并启动此工程
> 浏览器访问 localhost:4200

### 1、登陆页面

>  系统默认用户、账号、密码信息，数据在 **snails-api** 启动后初始化到数据库中，源码在 snails-api/src/main/java/com/kuzank/snails/init/InitPerson.java

| 用户名     | 账号       | 密码   | 备注                             |
| ---------- | ---------- | ------ | -------------------------------- |
| kuzank     | kuzank     | 123456 | 所属组织：Snails Studio > 技术部 |
| danxiaogui | danxiaogui | 123456 | 所属组织：Snails Studio > 财务部 |

![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/a_login.jpg)

### 2、首页
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/b_dashboard.jpg)

### 3、用户管理
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/c_userManage.jpg)

### 4、组织管理
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/d_orgunitManage.jpg)

### 5、菜单管理
> 菜单配置及菜单权限配置

![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/e_menuManage.jpg)

> 用户菜单权限预览

![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/f_menuPermissionPreview.jpg)

### 6、在线用户
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/g_onlineUser.jpg)

### 7、登陆日志
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/h_loginLog.jpg)

### 8、http请求
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/i_httpRequest.jpg)

### 9、系统异常
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/j_systemException.jpg)

### 10、G2图表
![](https://gitee.com/kuzan/Resource/raw/master/Snails/picture/k_g2Custom.jpg)


## 学习资源
- [Angular快速上手](https://angular.cn/guide/quickstart)
- [Ng-Zorro](https://ng.ant.design/docs/introduce/zh)
- [Ng-Alain](https://ng-alain.com/)


## 开源许可证
MIT
