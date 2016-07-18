# 概述

蓝牙打印模块（只支持Android）

APICloud 的 BtPrintModule 模块是一个蓝牙打印机模块。官方提供的ble是低功耗的蓝牙，但是有的蓝牙2.0小票机不支持，所以我就写了一个可能代码很烂大家能用就用啊！好的话给个star啊！

<ul id="tab" class="clearfix">
	<li class="active"><a href="#method-content">Method</a></li>
</ul>
<div id="method-content">

<div class="outline">
[initBT](#1)
[hostoryBt](#2)
[scanBT](#3)
[serviceBT](#4)
[connectBt](#5)
[isconnect](#6)
[writeBT](#7)
[sendMessageBT](#8)
</div>


**模块接口**

#**initBT**<dive id="1"></div>

初始化蓝牙

initBT()

##示例代码

```js
var BtPrintModule = api.require('BtPrintModule');
BtPrintModule.initBT();
```
##备注

1.设备在不支持蓝牙的情况下回toast提示</br>
2.蓝牙没开启的情况下回请求开启

#**hostoryBt**<dive id="2"></div>

获取已配对的设备列表

hostoryBt(callback(ret))

##callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```js
{
    service:[{       //数组类型；获取到已配对的蓝牙设备
    	name: '',    //字符串类型；扫描到的蓝牙设备的名字
    	address: ''  //字符串类型；扫描到的蓝牙设备的UUID
    },...]
}
```

##示例代码

```js
var BtPrintModule = api.require('BtPrintModule');
BtPrintModule.hostoryBt(function(ret){
	if( ret ){
        api.alert( {msg:JSON.stringify( ret )} );
    }
});
```

#**scanBT**<dive id="3"></div>

扫描未配对的蓝牙设备

scanBT()

##备注

已开启扫描的话，再次调用就会关闭扫描

#**serviceBT**<dive id="4"></div>

获取扫描到未配对的设备

serviceBT(callback(ret))

##callback(ret)

ret：

- 类型：JSON对象
- 内部字段：

```js
{
    code:0 ,		//数字类型；连接失败时返回错误码，取值范围如下：
    				//0: 扫描结束
    				//1：扫描还未结束

  	status:false ,	//布尔类型；是否有设备，true|false
  					//true: 设备列表不为空
  					//false: 设备列表为空

  	service:[{       //数组类型；获取到已配对的蓝牙设备
    	name: '',    //字符串类型；扫描到的蓝牙设备的名字
    	address: ''  //字符串类型；扫描到的蓝牙设备的UUID
    },...]

}
```

##示例代码

```js
var BtPrintModule = api.require('BtPrintModule');
BtPrintModule.serviceBT(function(ret){
	if( ret ){
        api.alert( {msg:JSON.stringify( ret )} );
    }
});
```

#**connectBt**<dive id="5"></div>

连接蓝牙设备

connectBt({params}, callback(ret))

##params

address：

- 类型：字符串
- 描述：要连接的蓝牙设备的 UUID 

##callback(ret)

ret:

- 类型：JSON 对象
- 内部字段：

```js
{
     status: true ,    //布尔类型；是否有设备，true|false
     msg: ''		   //字符串类型；返回消息
}
```

#**isconnect**<dive id="6"></div>

是否连接成功

isconnect(callback(ret))

##callback(ret)

ret:

- 类型：JSON 对象
- 内部字段：

```js
{
    code:0 ,  		//数字类型；返回的状态码，取值范围如下：
    				//0: 已连接
    				//1: 正在连接...
    				//2: 无连接
    				//3: 开始连接
    				//4: 设备已经成功连接过
   	address：'' ,   //字符串类型；扫描到的蓝牙设备的UUID
   	msg: ''			//字符串类型；返回消息
}
```

#**writeBT**<dive id="7"></div>

写入字符串

writeBT({params})

##params

writeBT:

- 类型：字符串
- 描述：需要打印的字符串

#**sendMessageBT**<dive id="8"></div>

写入订单消息

sendMessageBT({params},callback(ret))

##params

foods:

- 类型：数值类型
- 内部字段：

```js
{
    foods: [{
    	name: '' , //菜品名
    	num: '' ,  //菜品数量
    	money: ''  //菜品单价
    },...]
}

storeName：

- 类型：字符串类型
- 描述：店铺名称

seatNum：

- 类型：字符串类型
- 描述：店铺桌号

peopleNum：

- 类型：字符串类型
- 描述：就餐人数

orderRemark：

- 类型：字符串类型
- 描述：备注

orderAcount：

- 类型：字符串类型
- 描述：总价

orderPayType：

- 类型：字符串类型
- 描述：支付方式

orderNum：

- 类型：字符串类型
- 描述：订单号

storeAddress

- 类型：字符串类型
- 描述：商家地址

##callback(ret)

ret:

- 类型：JSON 对象
- 内部字段：

```js
{
    status:0 ,  		//布尔类型；是否成功
    msg：''				//字符串类型： 返回消息
}
```

##示例代码

```js
var BtPrintModule = null;
			var	blestauts = false;
			var intervalidState = false;
			var	intervalid;
			var isconInterStatus = false;
			var isconInter;
			//蓝牙模块初始化
			var bleInit = function() {
					BtPrintModule.initBT(function(ret, err) {
						alert(JSON.stringify(ret));
						alert(JSON.stringify(err));
					});
				}
			//扫描蓝牙设备
			var scanBle = function() {
					//搜索附近未配对设备
					BtPrintModule.scanBT();
					if(intervalidState){
						return;
					}
					intervalid = setInterval(function() {
						getBle();
					}, 2000);
					//获取已匹配
					BtPrintModule.hostoryBt(function(ret) {
						if(ret) {
							if(ret.service.length > 0) {
								var render = Y.tppl($("#tpplhestory").html(), ret);
								$(".list_hestory").html(render);
							}
						}
					});
				}
			//获取扫描的蓝牙
			var getBle = function() {
					BtPrintModule.serviceBT(function(ret, err) {
						if(ret) {
							if(intervalidState){
								clearInterval(intervalid);
								intervalidState = false;
							}
							if(ret.code == 0) {
								clearInterval(intervalid);
								$('.selectly-text').text('查找完毕');
								$('.selectly-num').text('发现' + ret.service.length + '个蓝牙设备');
								$('.icon-lanya').removeClass('lanya');
								if(ret.service.length > 0) {
									var render = Y.tppl($("#tppl").html(), ret);
									$(".list").html(render);
								}
							}else{
								if(ret){
								}
							}
						}
					});
				}
			//点击开始蓝牙扫描
			var selectLanya = function(e) {
					if(!blestauts) {
						$(e.target).toggleClass('lanya')
						if($(e.target).hasClass('lanya')) {
							$('.selectly-text').text('查找中....');
							$('.selectly-num').text('发现0个蓝牙设备');
							//开始扫描
							scanBle();
							intervalidState = false;
						} else {
							scanBle();
							intervalidState = true;
							$('.selectly-text').text('查找完毕');
							$('.selectly-num').text('点击可重新查找');
						}
					}
				}
			//蓝牙设备连接
			var connectLanya = function(address,name) {
					if(address != null) {
						BtPrintModule.connectBt({
							address: address
						});
					}
					Y.toastLoading(10000,"连接中...");
					isconInterStatus = true;
					if(!isconInterStatus){
						return;
					}
					isconInter = setInterval(function() {
						isconnect(name);
					}, 2000);
				}
			//是否连接成功
			var isconnect = function(name) {
					BtPrintModule.isconnect(function(ret) {
						if(ret.code == 0) {
							isconInterStatus = false;
							clearInterval(isconInter);
							Y.closeToast();
							$('.isconnect'+name).html("已连接");
						}else if(ret.code == 4){
							clearInterval(isconInter);
							Y.closeToast();
						}
					});
				}
			//打印测试
			var printTest = function() {
				BtPrintModule.writeBT({writeStr:"打印测试/n/n/n"});
			}
			api.ready(function() {
				//蓝牙模块导入
				BtPrintModule = api.require('BtPrintModule');
				//初始化
				bleInit();
			});
```


