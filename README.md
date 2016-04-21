# scrollDate
为了实现android月历类似效果，我自己编写的半成品，基本实现周历/月历的切换和跳转，其它功能各位可按需修改

### 简单使用

var scrollDate=$.scrollDate({
    selector:'#scrollContainer', //默认为body
    type:1, //1为周历，0为月历(默认)
    click:function(d){}  //点击事件
});


### 两种模式
####周历
实例化时传入参数 type:1 即可
####月历
默认为月历


### 接口
####上月/下月，上周/下周
scrollDate.next()  scrollDate.last()

####设置日期
scrollDate.setDate() 直接设置日期
