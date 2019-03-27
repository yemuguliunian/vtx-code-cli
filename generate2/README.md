# v2.0

## 变更点
1，使用yeoman-generator

2，使用ejs模板

3，去除logger日志中间件，使用debug

4，预览页面新增 复制 和 代码高亮 功能

## 结构
```
├── /bin/                 
├── /public/               
├── /src/             
	├── /generates/
	├── /job/
	├── /routes/
	├── /util/
	└── /views/
├── .editorconfig          
├── .gitignore
├── app.js # 入口文件
├── appliaction.yaml # 配置文件
├── CHANGELOG.md   
├── package.json
└── README.md
```

## 插件

### clipboard
复制到剪切板

https://clipboardjs.com/

### highlightjs
代码高亮

https://highlightjs.org/

## 知识点
1，DOMContentLoaded和load的区别

2，CSS tab-size 属性