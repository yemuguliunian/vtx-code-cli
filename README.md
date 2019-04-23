# Vortex前端代码模板化生成

## 面向群体
公司内部前端研发

## 结构
```
├── /cli/                  # 废弃
├── /dto/                  # 配置项服务 前端服务
├── /generate/             # 代码生成服务 
├── /generate2/            # 代码生成服务v2.0 （后续只维护这套）
├── .editorconfig          
├── README.md                
├── changelog.md           
```

## 使用方式
``` 
1.启动配置项服务
  dto目录下使用
  yarn install
  yarn start
2.启用代码生成服务
  generate2目录下
  yarn install
  yarn start
```
### 1.dto 路由
* /curd   			# curd配置
* /list   			# 列表
* /report 			# 报表
* /empty  			# 空模板

### 2.dto 功能清单
- [x] 生成模板
- [x] 预览 - 点击生成模板成功后可预览生成的代码内容
- [x] 导出模板和配置项
- [x] 自动缓存配置数据（防止误操作导致数据丢失），亦可以手动清除缓存

