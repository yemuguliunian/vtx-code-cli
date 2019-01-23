## 0.1.1 [2019-01-23]

* Bug: 优化CURD，list模板effects内列表查询判断取payload还是state的currentPage，0默认false，逻辑有误
* Update: 分页查询成功后的页码参数值由之前的Promise then => effects中处理

## 0.1.0 [2019-01-17]

* Feature: 模板配置项本地化缓存
* Feature: 生成模板现可支持导出配置文件
