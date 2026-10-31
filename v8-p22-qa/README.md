# V8 P2.2 独立 QA

入口：https://super-pu921.github.io/ad-factory-learning/v8-p22-qa/index.html#/components/bulk-lab

8 条虚构订单，6 步模拟：跨页勾选、本页全选、取消勾选、危险确认取消、精确确认词、撤销日志。

QA 使用完全独立的 localStorage 键，不读入正式学习数据；QA 页面不注册 Service Worker。没有真实 ERP 归档、删除或批量修改功能。

正式版本依然独立，本目录只为验收。
