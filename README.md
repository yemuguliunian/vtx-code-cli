# Vortex内部前端代码模板化生成
 
## 立意
减少重复繁琐的工作，利用节省的时间去审查代码，学习新知识，实现个人和公司双赢的局面

不可避免的是代码风格的统一，当然实话来说CURD就是个体力活，谁愿意去一个个去写呢

## 面向群体
公司内部前端研发

## 优缺点
1，重复繁琐的工作通过配置工具自动生成 **初始（划重点，不可能生成即用）** 模板

2，代码风格统一，项目中的CURD各组协调应该会比较方便吧

3，**可能代表更多的工作？**

## 涉及知识点

### nodejs 
基于 Chrome V8 引擎的 JavaScript 运行环境

http://nodejs.cn/

### nodemon 
nodejs开发辅助工具

https://www.npmjs.com/package/nodemon

### express 
基于Node.js 平台,快速、开放、极简的 Web 开发框架

http://www.expressjs.com.cn/

### express-generator 
express应用生成器

http://expressjs.com/en/starter/generator.html

### morgan
Express框架 中间件记录日志

https://www.npmjs.com/package/morgan

### yamljs
配置文件读取

https://www.npmjs.com/package/yamljs

### zip-local
文件压缩

https://www.npmjs.com/package/zip-local

### console-color-mr

https://www.npmjs.com/package/console-color-mr

### moment
时间管理工具

http://momentjs.cn/

### lodashjs

是一个一致性、模块化、高性能的 JavaScript 实用工具库。

https://www.lodashjs.com/

## 问题点
1，底层代码的可读性，可维护性。

2，多人同时操作的问题，多线程冲突问题

3，请求异步回调的处理

4，Promise递归

5，在setTimeout之类回调函数中this丢失的问题

