## 0.1.6 [2019-03-22]

*BUG: 新增Add.js 为日月年时间类型时修复值无法修改的问题 Modallist comType值修改为""(空)

## 0.1.5 [2019-03-19]

* BUG: 去除文本域中的maxLength属性

## 0.1.4 [2019-03-13]

* BUG: effects 下拉数据 if else 语句 条件修复 !!data.data && !data.result => !!data && !data.result

## 0.1.3 [2019-03-13]

* Feature: 多个下拉数据源生成代码导致对象属性存在重复在IE严格模式下报错的问题， 故加上去重操作

## 0.1.2 [2019-01-29]

* BUG: 优化新增保存模态框关闭瞬间验证提示闪烁的问题

## 0.1.1 [2019-01-23]

* Bug: 优化CURD，list模板effects内列表查询判断取payload还是state的currentPage，0默认false，逻辑有误
* Update: 分页查询成功后的页码参数值由之前的Promise then => effects中处理

## 0.1.0 [2019-01-17]

* Feature: 模板配置项本地化缓存
* Feature: 生成模板现可支持导出配置文件
