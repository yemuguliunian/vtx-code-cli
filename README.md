# Vortex内部前端代码模板化生成
 
## 立意
减少重复繁琐的工作，利用节省的时间去审查代码，学习新知识，实现个人和公司双赢的局面

不可避免的是代码风格的统一，当然实话来说CURD就是个体力活，谁愿意去一个个去写呢

## 面向群体
公司内部前端研发

## 问题点
1，底层代码的可读性，可维护性。

2，多人同时操作的问题，多线程冲突问题

3，请求异步回调的处理

4，Promise递归

## 优缺点
1，重复繁琐的工作通过配置工具自动生成 **初始（划重点，不可能生成即用）** 模板

2，代码风格统一，项目中的CURD各组协调应该会比较方便吧

3，**可能代表更多的工作？**

## 实现目标点
1，可视化界面配置（以实现）

2，自动生成CURD一套模板

3，可导出生成的模板 （已实现）

4，生成模板缓存，最多保存7天，定时清理

5，后续可加入报表的模板化生成

## 涉及知识点
`底层实现主要就是文件的写入，很low的字符串拼接写入文件中`

react，dva，（可视化配置页面是vtx-cli生成的项目）

node（fs，path 涉及文件的读写），es6，express（请求处理），yamljs（配置文件读取），moment（时间管理工具），zip-local（文件压缩）

http://momentjs.cn/

https://www.npmjs.com/package/express

https://www.npmjs.com/package/ipware

https://www.npmjs.com/package/yamljs

https://www.npmjs.com/package/zip-local

https://www.npmjs.com/package/console-color-mr

https://www.npmjs.com/package/rimraf

