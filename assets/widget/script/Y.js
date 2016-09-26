/**
 * @name    定制化apicloud-js框架
 * @time    2016-07-08
 * @version 0.0.1
 * @author  barret.zhi 
 */
;! function(factory) {
	if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
		var target = module['exports'] || exports;
		factory(target);
	} else if (typeof define === 'function' && define['amd']) {
		define(['exports'], factory);
	} else {
		factory(window['Y'] = {
			tppl_flag: ['{{', '}}'],
			trim: function(str) {
				if (str) {
					return str.replace(/(^\s*)|(\s*$)/g, '');
				}
			},
			getClassOrTagName: function(str) {
				if (str && str.length > 0) {
					if (str.substr(0, 1) == "." || str.substr(0, 1) == "#") {
						return str.substr(1);
					} else {
						return str;
					}
				}
				return "*";
			},
			isNumber: function(str) {
				return !isNaN(str);
			},
			isString: function(obj) {
				var that = this;

				return that.isTargetType(obj, "string") && obj != null && obj != undefined;
			},
			isBoolean: function(obj) {
				var that = this;
				return that.isTargetType(obj, "boolean");
			},
			isPlusDecimal: function(str) {
				return (/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/).test(str);
			},
			isDate: function(str) {
				return (/^(?:(?:1[6-9]|[2-9][0-9])[0-9]{2}([-/.]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:(?:1[6-9]|[2-9][0-9])(?:0[48]|[2468][048]|[13579][26])|(?:16|[2468][048]|[3579][26])00)([-/.]?)0?2\2(?:29))(\s+([01][0-9]:|2[0-3]:)?[0-5][0-9]:[0-5][0-9])?$/).text(str);
			},
			isNullOrEmpty: function(str) {
				var that = this;
				return (str == null || str == undefined || that.trim(str) == "") ? true : false;
			},
			isTargetType: function(obj, typeString) {
				return typeof obj === typeString;
			},
			isElement: function(obj) {
				return !!(obj && (obj.nodeType == 1 || obj.nodeType == 9));
			},
			isElements: function(arr) {
				var that = this;
				var flag = true;
				if (that.isArray(arr)) {
					for (var i = 0; i < arr.length; i++) {
						if (that.isElement(arr[i]) == false) {
							flag = false;
							break;
						}
					}
				} else {
					flag = false;
				}

				return flag;
			},
			getNowDateFormat: function(dateSeparator, timeSeparator, isShowTime, datetime) {
				var that = this;
				dateSeparator = that.isNullOrEmpty(dateSeparator) ? "-" : dateSeparator;
				timeSeparator = that.isNullOrEmpty(timeSeparator) ? ":" : timeSeparator;
				isShowTime = that.isTargetType(arguments[2], "boolean") ? arguments[2] : true;

				var now = datetime ? datetime : new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var date = now.getDate();
				var hours = now.getHours();
				var minutes = now.getMinutes();
				var seconds = now.getSeconds();

				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (date >= 0 && date <= 9) {
					date = "0" + date;
				}
				var _date = year + dateSeparator + month + dateSeparator + date;
				var _time = hours + timeSeparator + minutes + timeSeparator + seconds;

				return isShowTime ? (_date + " " + _time) : _date;
			},
			isObject: function(obj) {
				var that = this;
				return (that.isTargetType(obj, "object") && obj != null && obj != undefined);
			},
			cloneObj: function(oldObj) {
				var that = this;

				if (that.isObject(oldObj) == false) {
					return oldObj;
				}
				var newObj = new Object();
				for (var i in oldObj) {
					newObj[i] = that.cloneObj(oldObj[i]);
				}
				return newObj;
			},
			extendObj: function() {
				var that = this;

				var args = arguments;
				if (args.length < 2) {
					return;
				}
				var temp = that.cloneObj(args[0]);
				//调用复制对象方法
				for (var n = 1; n < args.length; n++) {
					for (var i in args[n]) {
						temp[i] = args[n][i];
					}
				}
				return temp;
			},
			isFunction: function(obj) {
				var that = this;
				return that.isTargetType(obj, "function");
			},
			isArray: function(arr) {
				return (toString.apply(arr) === '[object Array]') || arr instanceof NodeList;
			},
			newGUID: function() {
				function _sub() {
					return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
				}

				return (_sub() + _sub() + "-" + _sub() + "-" + _sub() + "-" + _sub() + "-" + _sub() + _sub() + _sub());
			},
			unique: function(arr) {
				var that = this;

				if (!that.isArray(arr)) {
					return arr;
				}
				var result = [],
					hash = {};
				for (var i = 0, elem;
					(elem = arr[i]) != null; i++) {
					if (!hash[elem]) {
						result.push(elem);
						hash[elem] = true;
					}
				}
				return result;
			},
			// 获取当前光标位置
			getCursorPosition: function(element) {
				var CaretPos = 0;
				// IE Support
				if (document.selection) {
					element.focus();
					var Sel = document.selection.createRange();
					Sel.moveStart('character', -element.value.length);
					CaretPos = Sel.text.length;
				}
				// Firefox support
				else if (element.selectionStart || element.selectionStart == '0') {
					CaretPos = element.selectionStart;
				}
				return (CaretPos);
			},
			// 设置当前管标的位置
			setCursorPosition: function(element, pos) {
				if (element.setSelectionRange) {
					element.focus();
					element.setSelectionRange(pos, pos);
				} else if (element.createTextRange) {
					var range = element.createTextRange();
					range.collapse(true);
					range.moveEnd('character', pos);
					range.moveStart('character', pos);
					range.select();
				}
			},
			// 在光标处插入内容
			insertAtCursor: function(element, value) {
				if (document.selection) {
					element.focus();
					sel = document.selection.createRange();
					sel.text = value;
					sel.select();
				} else if (element.selectionStart || element.selectionStart == '0') {
					var startPos = element.selectionStart;
					var endPos = element.selectionEnd;
					var restoreTop = element.scrollTop;
					element.value = element.value.substring(0, startPos) + value + element.value.substring(endPos, element.value.length);
					if (restoreTop > 0) {
						element.scrollTop = restoreTop;
					}
					element.focus();
					element.selectionStart = startPos + value.length;
					element.selectionEnd = startPos + value.length;
				} else {
					element.value += value;
					element.focus();
				}
			},
			// ######################### 事件
			addEventListener: function(callback, name, extra) {
				var that = this;
				var o = {};
				o.name = name;

				if (extra) {
					extra = that.isObject(extra) ? extra : {};
					o.extra = extra;
				}

				api.addEventListener(o, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});
			},
			batterylow: function(callback) {
				var that = this;
				that.addEventListener(callback, "batterylow");
			},
			batterystatus: function(callback) {
				var that = this;
				that.addEventListener(callback, "batterystatus");
			},
			keyback: function(callback) {
				var that = this;
				that.addEventListener(callback, "keyback");
			},
			keymenu: function(callback) {
				var that = this;
				that.addEventListener(callback, "keymenu");
			},
			volumeup: function(callback) {
				var that = this;
				that.addEventListener(callback, "volumeup");
			},
			volumedown: function(callback) {
				var that = this;
				that.addEventListener(callback, "volumedown");
			},
			offline: function(callback) {
				var that = this;
				that.addEventListener(callback, "offline");
			},
			online: function(callback) {
				var that = this;
				that.addEventListener(callback, "online");
			},
			pause: function(callback) {
				var that = this;
				that.addEventListener(callback, "pause");
			},
			resume: function(callback) {
				var that = this;
				that.addEventListener(callback, "resume");
			},
			scrolltobottom: function(callback, threshold) {
				var that = this;
				threshold = Math.abs(that.isNumber(threshold) ? Number(threshold) : 0);

				that.addEventListener(callback, "scrolltobottom", {
					threshold: threshold
				});
			},
			shake: function(callback) {
				var that = this;
				that.addEventListener(callback, "shake");
			},
			takescreenshot: function(callback) {
				var that = this;
				that.addEventListener(callback, "takescreenshot");
			},
			swipedown: function(callback) {
				var that = this;
				that.addEventListener(callback, "swipedown");
			},
			swipeleft: function(callback) {
				var that = this;
				that.addEventListener(callback, "swipeleft");
			},
			swiperight: function(callback) {
				var that = this;
				that.addEventListener(callback, "swiperight");
			},
			swipeup: function(callback) {
				var that = this;
				that.addEventListener(callback, "swipeup");
			},
			tap: function(callback) {
				var that = this;
				that.addEventListener(callback, "tap");
			},
			longpress: function(callback) {
				var that = this;
				that.addEventListener(callback, "longpress");
			},
			viewappear: function(callback) {
				var that = this;
				that.addEventListener(callback, "viewappear");
			},
			viewdisappear: function(callback) {
				var that = this;
				that.addEventListener(callback, "viewdisappear");
			},
			noticeclicked: function(callback) {
				var that = this;
				that.addEventListener(callback, "noticeclicked");
			},
			appintent: function(callback) {
				var that = this;
				that.addEventListener(callback, "appintent");
			},
			smartupdatefinish: function(callback) {
				var that = this;
				that.addEventListener(callback, "smartupdatefinish");
			},
			launchviewclicked: function(callback) {
				var that = this;
				that.addEventListener(callback, "launchviewclicked");
			},
			// ######################### 配置
			DEFAULT_CONFIG: {
				openWin_CONFIG: {
					bounces: false,
					bgColor: "rgba(0,0,0,0)",
					scrollToTop: true,
					vScrollBarEnabled: false,
					hScrollBarEnabled: false,
					scaleEnabled: false,
					slidBackEnabled: true,
					slidBackType: "edge",
					delay: 0,
					reload: false,
					allowEdit: false,
					softInputMode: "auto",
					useWKWebView: false
				},
				closeWin_CONFIG: {},
				closeToWin_CONFIG: {},
				setWinAttr_CONFIG: {},
				openFrame_CONFIG: {
					bounces: true,
					bgColor: "rgba(0,0,0,0)",
					scrollToTop: true,
					vScrollBarEnabled: false,
					hScrollBarEnabled: false,
					scaleEnabled: false,
					rect: {
						x: 0,
						y: 0,
						w: 'auto',
						h: 'auto',
						marginLeft: 0,
						marginTop: 0,
						marginBottom: 0,
						marginRight: 0
					},
					//progress: {
					//    type: "page",
					//    color: "#45C01A"
					//},
					reload: false,
					allowEdit: false,
					softInputMode: 'auto',
					useWKWebView: true
				},
				setFrameAttr_CONFIG: {},
				animation_CONFIG: {
					delay: 0,
					duration: 0,
					curve: "ease_in_out",
					repeatCount: 0,
					autoreverse: false
				},
				openFrameGroup_CONFIG: {
					scrollEnabled: true,
					rect: {
						x: 0,
						y: 0,
						w: 'auto',
						h: 'auto',
						marginLeft: 0,
						marginTop: 0,
						marginBottom: 0,
						marginRight: 0
					},
					index: 0,
					preload: 1
				},
				setFrameGroupAttr_CONFIG: {},
				setFrameGroupIndex_CONFIG: {},
				openPopoverWin_CONFIG: {
					width: 540,
					height: 620,
					bgColor: 'rgba(0,0,0,0)',
					scrollToTop: true,
					bounces: true,
					vScrollBarEnabled: false,
					hScrollBarEnabled: false,
					scaleEnabled: false,
					showProgress: false,
					allowEdit: false,
					softInputMode: 'auto'
				},
				openSlidLayout_CONFIG: {
					type: "left"
				},
				openDrawerLayout_CONFIG: {
					bounces: false,
					bgColor: "rgba(0,0,0,0)",
					scrollToTop: true,
					vScrollBarEnabled: false,
					hScrollBarEnabled: false,
					scaleEnabled: false,
					slidBackEnabled: true,
					slidBackType: "full",
					showProgress: false,
					delay: 0,
					reload: false,
					allowEdit: false,
					softInputMode: "auto"
				},
				removeLaunchView_CONFIG: {},
				openApp_CONFIG: {
					androidPkg: "android.intent.action.VIEW",
					mimeType: "text/html"
				},
				openWidget_CONFIG: {},
				closeWidget_CONFIG: {
					silent: false
				},
				ajax_CONFIG: {
					method: "get",
					cache: false,
					timeout: 30,
					dataType: "json",
					charset: "utf-8",
					report: true,
					returnAll: false
				},
				download_CONFIG: {
					report: true,
					cache: true,
					allowResume: true
				},
				imageCache_CONFIG: {
					policy: "cache_else_network",
					thumbnail: true
				},
				notification_CONFIG: {
					vibrate: [500, 500],
					sound: "default",
					light: false
				},
				startLocation_CONFIG: {
					accuracy: "100m",
					filter: 1.0,
					autoStop: true
				},
				alert_CONFIG: {
					buttons: ["确定"]
				},
				showProgress_CONFIG: {
					style: 'default',
					animationType: 'zoom',
					title: '加载中',
					text: '请稍后...',
					modal: false
				},
				setRefreshHeaderInfo_CONFIG: {
					visible: true,
					loadingImg: 'widget://image/refresh.png',
					bgColor: '#f1f1f1',
					textColor: '#999',
					textDown: '下拉可以刷新...',
					textUp: '松开可以刷新...',
					textLoading: '加载中...',
					showTime: true
				},
				getPicture_CONFIG: {
					sourceType: "library",
					encodingType: "png",
					mediaValue: "pic",
					destinationType: "url",
					allowEdit: false,
					quality: 50,
					videoQuality: "medium",
					saveToPhotoAlbum: false
				}
			},
			// ######################### 方法
			/**
			 * @description 打开一个窗体
			 * @constructor
			 * @alias openWin
			 * @param {String} winName 名称
			 * @param {String} winUrl  文件路径
			 * @param {Object} winPageParam 携带的参数
			 * @param {Object} options 配置属性
			 */
			openWin: function(winName, winUrl, winPageParam, options) {
				var that = this;
				var o = {};
				o.name = winName;
				o.url = winUrl;
				o.pageParam = that.isObject(winPageParam) ? winPageParam : {};

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openWin_CONFIG, o, options);

				api.openWin(opt);

			},
			/**
			 * @description 关闭窗体
			 * @constructor
			 * @param {Object} winName
			 * @param {Object} options
			 */
			closeWin: function(winName, options) {
				var that = this;
				var o = {};
				if (winName) {
					o.name = winName;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.closeWin_CONFIG, o, options);

				api.closeWin(opt);
			},
			/**
			 * @description 关闭某个主窗体
			 * @constructor
			 * @param {Object} winName
			 * @param {Object} options
			 */
			closeToWin: function(winName, options) {
				var that = this;
				var o = {};
				winName = (!winName) ? "root" : winName;
				o.name = winName;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.closeToWin_CONFIG, o, options);

				api.closeToWin(opt);

			},
			/**
			 * @description 设置主窗体的属性
			 * @constructor
			 * @param {Object} options
			 */
			setWinAttr: function(options) {
				var that = this;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.setWinAttr_CONFIG, options);

				api.setWinAttr(opt)

			},
			/**
			 * @description 打开一个子窗口
			 * @constructor
			 * @param {Object} frameName
			 * @param {Object} frameUrl
			 * @param {Object} framePageParam
			 * @param {Object} options
			 */
			openFrame: function(frameName, frameUrl, framePageParam, options) {
				var that = this;
				var o = {};
				o.name = frameName;
				o.url = frameUrl;
				o.pageParam = that.isObject(framePageParam) ? framePageParam : {};

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openFrame_CONFIG, o, options);

				api.openFrame(opt);

			},
			/**
			 * @description 关闭一个子窗口
			 * @constructor
			 * @param {Object} frameName
			 */
			closeFrame: function(frameName) {
				var that = this;

				var o = {};
				if (frameName) {
					o.name = frameName;
				}
				api.closeFrame(o);

			},
			/**
			 * @description 设置子窗体的属性
			 * @constructor
			 * @param {Object} frameName
			 * @param {Object} hidden
			 * @param {Object} options
			 */
			setFrameAttr: function(frameName, hidden, options) {
				var that = this;
				var o = {};
				o.name = frameName;
				if (that.isTargetType(hidden, "boolean")) {
					o.hidden = hidden;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.setFrameAttr_CONFIG, o, options);
				api.setFrameAttr(opt);

			},
			/**
			 * @description 调整 一个子窗口到前面
			 * @constructor
			 * @param {Object} fromFrameName
			 * @param {Object} toFrameName
			 */
			bringFrameToFront: function(fromFrameName, toFrameName) {
				var that = this;

				var o = {};
				o.from = fromFrameName;

				if (toFrameName) {
					o.to = toFrameName;
				}
				api.bringFrameToFront(o);

			},
			/**
			 * @description 调整一个子窗口到后面
			 * @constructor
			 * @param {Object} fromFrameName
			 * @param {Object} toFrameName
			 */
			sendFrameToBack: function(fromFrameName, toFrameName) {
				var that = this;
				var o = {};
				o.from = fromFrameName;

				if (toFrameName) {
					o.to = toFrameName;
				}
				api.sendFrameToBack(o);

			},
			/**
			 * @description 设置指定子窗体的加载监听，仅在主窗体中调用生效，可以对多个子窗体进行监听。
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} frameName
			 */
			setFrameClient: function(callback, frameName) {
				var that = this;
				api.setFrameClient({
					frameName: frameName
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 子窗体动画，支持平移，缩放，旋转和透明度变化
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} frameName
			 * @param {Object} options
			 */
			animation: function(callback, frameName, options) {
				var that = this;
				var o = {};
				if (frameName) {
					o.name = frameName;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.animation_CONFIG, o, options);

				api.animation(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 子窗口组打开
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} groupName
			 * @param {Object} frames
			 * @param {Object} index
			 * @param {Object} options
			 */
			openFrameGroup: function(callback, groupName, frames, index, options) {
				var that = this;
				var o = {};
				o.name = groupName;
				o.index = Math.abs(that.isNumber(index) ? Number(index) : 0);

				if (!that.isArray(frames)) {
					console.error("只接收frame对象数组");
				}
				if (frames.length == 0) {
					console.error("frame对象数组至少要有一个frame对象");
				}

				// 移除frame的rect
				var _frames = [];
				for (var i = 0; i < frames.length; i++) {
					var _frame = frames[i];
					var tempFrame = that.extendObj(that.DEFAULT_CONFIG.openFrame_CONFIG, _frame);
					delete tempFrame['rect'];
					_frames.push(tempFrame);
				}
				o.frames = _frames;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openFrameGroup_CONFIG, o, options);

				api.openFrameGroup(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 关闭某个子窗口组
			 * @constructor
			 * @param {Object} groupName
			 */
			closeFrameGroup: function(groupName) {
				var that = this;

				api.closeFrameGroup({
					name: groupName
				});

			},
			/**
			 * @description 设置窗口组的属性
			 * @constructor
			 * @param {Object} groupName
			 * @param {Object} hidden
			 * @param {Object} options
			 */
			setFrameGroupAttr: function(groupName, hidden, options) {
				var that = this;
				var o = {};
				o.name = groupName;
				if (that.isTargetType(hidden, "boolean")) {
					o.hidden = hidden;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.setFrameGroupAttr_CONFIG, o, options);

				api.setFrameGroupAttr(opt);

			},
			/**
			 * @description 设置窗口组的显示哪个窗体显示
			 * @constructor
			 * @param {Object} groupName
			 * @param {Object} index
			 * @param {Object} isScroll
			 * @param {Object} options
			 */
			setFrameGroupIndex: function(groupName, index, isScroll, options) {
				var that = this;
				var o = {};
				o.name = groupName;
				o.index = Math.abs(that.isNumber(index) ? Number(index) : 0);
				if (that.isTargetType(isScroll, "boolean")) {
					o.scroll = isScroll;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.setFrameGroupIndex_CONFIG, o, options);

				api.setFrameGroupIndex(opt);

			},
			/**
			 * @description iPad 上面打开弹出层窗口
			 * @constructor
			 * @param {Object} popoverWinName
			 * @param {Object} popoverWinUrl
			 * @param {Object} popoverWinpageParam
			 * @param {Object} options
			 */
			openPopoverWin: function(popoverWinName, popoverWinUrl, popoverWinpageParam, options) {
				var that = this;
				var o = {};
				o.name = popoverWinName;
				o.url = popoverWinUrl;
				o.pageParam = that.isObject(popoverWinpageParam) ? popoverWinpageParam : {};

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openPopoverWin_CONFIG, o, options);

				api.openPopoverWin(opt);

			},
			/**
			 * 
			 */
			closePopoverWin: function() {
				var that = this;

				api.closePopoverWin();

			},
			/**
			 * @description 设置侧滑窗口
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} fixedPane
			 * @param {Object} slidPane
			 * @param {Object} options
			 */
			openSlidLayout: function(callback, fixedPane, slidPane, options) {
				var that = this;
				var o = {};

				if (that.isObject(fixedPane) == false) {
					console.error("fixedPane必须是frame对象");
				}
				if (that.isObject(slidPane) == false) {
					console.error("slidPane必须是frame对象");
				}

				var _fixedPane = that.extendObj(that.DEFAULT_CONFIG.openFrame_CONFIG, fixedPane);
				delete _fixedPane['rect'];
				o.fixedPane = _fixedPane;

				var _slidPane = that.extendObj(that.DEFAULT_CONFIG.openFrame_CONFIG, slidPane);
				delete _slidPane['rect'];
				o.slidPane = _slidPane;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openSlidLayout_CONFIG, o, options);

				api.openSlidLayout(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 打开侧滑窗口
			 * @constructor
 			 * @param {Object} type
			 */
			openSlidPane: function(type) {
				var that = this;
				var typeArr = ["left", "right", "all"];
				type = that.isString(type) ? type : "left";
				type = typeArr.indexOf(type) > -1 ? type : "left";

				api.openSlidPane({
					type: type
				});

			},
			/**
			 * @description 关闭侧滑窗口
			 * @constructor
			 */
			closeSlidPane: function() {
				var that = this;

				api.closeSlidPane();

			},
			/**
			 * @description 锁定侧滑窗口
			 * @constructor
			 */
			lockSlidPane: function() {
				var that = this;

				api.lockSlidPane();

			},
			/**
			 * @description 解锁侧滑窗口
			 * @constructor
			 */
			unlockSlidPane: function() {
				var that = this;

				api.unlockSlidPane();

			},
			/**
			 * @description 设置抽屉窗口
			 * @constructor
			 * @param {Object} drawerName
			 * @param {Object} drawerUrl
			 * @param {Object} leftPane
			 * @param {Object} rightPane
			 * @param {Object} drawerPageParam
			 * @param {Object} options
			 */
			openDrawerLayout: function(drawerName, drawerUrl, leftPane, rightPane, drawerPageParam, options) {
				var that = this;
				var o = {};
				o.name = drawerName;
				o.url = drawerUrl;

				if (leftPane) {
					if (that.isObject(leftPane) == false) {
						console.error("leftPane必须是frame对象");
					}
					var _leftPane = that.extendObj(that.DEFAULT_CONFIG.openFrame_CONFIG, leftPane);
					delete _leftPane['rect'];
					o.leftPane = _leftPane;
				}

				if (rightPane) {
					if (that.isObject(rightPane) == false) {
						console.error("leftPane必须是frame对象");
					}
					var _rightPane = that.extendObj(that.DEFAULT_CONFIG.openFrame_CONFIG, rightPane);
					delete _rightPane['rect'];
					o.rightPane = _rightPane;
				}

				o.pageParam = that.isObject(drawerPageParam) ? drawerPageParam : {};

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openDrawerLayout_CONFIG, o, options);

				api.openDrawerLayout(opt);

			},
			/**
			 * @description 打开抽屉窗口
 			 * @param {Object} type
			 */
			openDrawerPane: function(type) {
				var that = this;
				var typeArr = ["left", "right"];
				type = that.isString(type) ? type : "left";
				type = typeArr.indexOf(type) > -1 ? type : "left";

				api.openDrawerPane({
					type: type
				});

			},
			/**
			 * @description 关闭抽屉窗口
			 * @constructor
			 */
			closeDrawerPane: function() {
				var that = this;
				api.closeDrawerPane();

			},
			/**
			 * @description 页面间参数透传
			 * @constructor
			 * @param {Object} winName
			 * @param {Object} frameName
			 * @param {Object} script
			 */
			execScript: function(winName, frameName, script) {
				var that = this;
				script = that.isString(script) ? script : "();";

				if (winName) {
					if (frameName) {
						api.execScript({
							name: winName,
							frameName: frameName,
							script: script
						});
					} else {
						api.execScript({
							name: winName,
							script: script
						});
					}
				} else {
					api.execScript({
						frameName: frameName,
						script: script
					});
				}

			},
			/**
			 * @description 历史记录后退一页
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} frameName
			 */
			historyBack: function(callback, frameName) {
				var that = this;

				api.historyBack({
					frameName: frameName
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 历史记录前进一页
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} frameName
			 */
			historyForward: function(callback, frameName) {
				var that = this;

				api.historyForward({
					frameName: frameName
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 页面上一页
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} isTop
			 */
			pageUp: function(callback, isTop) {
				var that = this;

				isTop = that.isTargetType(isTop, "boolean") ? isTop : false;

				api.pageUp({
					top: isTop
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 页面下一页
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} isBottom
			 */
			pageDown: function(callback, isBottom) {
				var that = this;

				isBottom = that.isTargetType(isBottom, "boolean") ? isBottom : false;

				api.pageDown({
					bottom: isBottom
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 手动移除启动页
			 * @constructor
			 * @param {Object} options
			 */
			removeLaunchView: function(options) {
				var that = this;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.removeLaunchView_CONFIG, options);

				api.removeLaunchView(opt);

			},
			/**
			 * @description 解析元素 tapmode 属性，优化点击事件处理
			 * @constructor
			 */
			parseTapmode: function() {
				var that = this;

				api.parseTapmode();

			},
			/**
			 * @description 安装app
			 * @constructor
 			 * @param {Object} appUri
			 */
			installApp: function(appUri) {
				var that = this;

				api.installApp({
					appUri: appUri
				});

			},
			/**
			 * @description 判断app是否安装
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} appBundle
			 */
			appInstalled: function(callback, appBundle) {
				var that = this;

				api.appInstalled({
					appBundle: appBundle
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 打开第三方app
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} url
			 * @param {Object} appParam
			 * @param {Object} options
			 */
			openApp: function(callback, url, appParam, options) {
				var that = this;
				var o = {};

				if (that.systemType == "ios") {
					if (url) {
						o.iosUrl = url;
					}
					if (that.isObject(appParam)) {
						o.appParam = appParam;
					}
				} else {
					if (url) {
						o.uri = url;
					}
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openApp_CONFIG, o, options);

				api.openApp(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 重启应用，云修复完成后可以调用此方法来重启应用使云修复生效
			 * @constructor
			 */
			rebootApp: function() {
				var that = this;

				api.rebootApp();

			},
			/**
			 * @description 打开 Widget，若此 widget 已经被打开，则会把其调整到最前面显示
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} wgtID
			 * @param {Object} wgtParam
			 * @param {Object} options
			 */
			openWidget: function(callback, wgtID, wgtParam, options) {
				var that = this;
				var o = {};
				o.id = wgtID;
				if (that.isObject(wgtParam)) {
					o.wgtParam = wgtParam;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.openWidget_CONFIG, o, options);

				api.openWidget(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 关闭指定 widget
			 * @constructor
			 * @param {Object} wgtID
			 * @param {Object} returnData
			 * @param {Object} options
			 */
			closeWidget: function(wgtID, returnData, options) {
				var that = this;
				var o = {};
				if (wgtID) {
					o.id = wgtID;
				}
				if (that.isObject(returnData)) {
					o.retData = returnData;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.closeWidget_CONFIG, o, options);

				api.closeWidget(opt);

			},
			/**
			 * @description 封装的ajax请求
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} url
			 * @param {Object} method
			 * @param {Object} data
			 * @param {Object} dataType
			 * @param {Object} options
			 */
			ajax: function(callback, url, method, data, dataType, options) {
				var that = this;
				var o = {};
				o.url = url;
				o.method = method ? method : "get";
				o.dataType = dataType ? dataType : "json";
				if (that.isObject(data) && o.method == "post") {
					o.data = data;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.ajax_CONFIG, o, options);

				api.ajax(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 取消ajax
			 * @constructor
 			 * @param {Object} tag
			 */
			cancelAjax: function(tag) {
				var that = this;

				api.cancelAjax({
					tag: tag
				});

			},
			/**
			 * @description 下载文件
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} url
			 * @param {Object} savePath
			 * @param {Object} options
			 */
			download: function(callback, url, savePath, options) {
				var that = this;
				var o = {};
				o.url = url;
				if (savePath) {
					o.savePath = savePath;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.download_CONFIG, o, options);

				api.download(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 取消下载
			 * @constructor
 			 * @param {Object} url
			 */
			cancelDownload: function(url) {

				api.cancelDownload({
					url: url
				});

			},
			/**
			 * @description 图片缓存
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} url
			 * @param {Object} options
			 */
			imageCache: function(callback, url, options) {
				var that = this;
				var o = {};
				o.url = url;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.imageCache_CONFIG, o, options);

				api.imageCache(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 文件读取
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} path
			 */
			readFile: function(callback, path) {
				var that = this;

				api.readFile({
					path: path
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 文件写入
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} path
			 * @param {Object} data
			 * @param {Object} isAppend
			 */
			writeFile: function(callback, path, data, isAppend) {
				var that = this;

				isAppend = that.isTargetType(isAppend, "boolean") ? isAppend : false;
				if (that.isObject(data)) {
					data = JSON.stringify(data);
				}

				api.writeFile({
					path: path,
					data: data,
					append: isAppend
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 设置原生存储属性
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} key
			 * @param {Object} value
			 */
			setPrefs: function(callback, key, value) {
				var that = this;

				if (that.isObject(value)) {
					value = JSON.stringify(value);
				}

				api.setPrefs({
					key: key,
					value: value
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 获取原生存储属性
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} key
			 */
			getPrefs: function(callback, key) {
				var that = this;

				api.getPrefs({
					key: key
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 移除原生存储属性
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} key
			 */
			removePrefs: function(callback, key) {
				var that = this;

				api.removePrefs({
					key: key
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 清空缓存
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} timeThreshold
			 */
			clearCache: function(callback, timeThreshold) {
				var that = this;

				timeThreshold = Math.abs(that.isNumber(timeThreshold) ? Number(timeThreshold) : 0);

				api.clearCache({
					timeThreshold: timeThreshold
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 获得缓存的大小
			 * @constructor
 			 * @param {Object} callback
			 */
			getCacheSize: function(callback) {
				var that = this;

				api.getCacheSize(function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 获取剩余缓存的大小
			 * @constructor
 			 * @param {Object} callback
			 */
			getFreeDiskSpace: function(callback) {
				var that = this;

				api.getFreeDiskSpace(function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description  获得加密数据的大小
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} key
			 */
			loadSecureValue: function(callback, key) {
				var that = this;

				api.loadSecureValue({
					key: key
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 移除事件的监听
			 * @constructor
 			 * @param {Object} name
			 */
			removeEventListener: function(name) {
				var that = this;

				api.removeEventListener({
					name: name
				});

			},
			/**
			 * @description 发送时间
			 * @constructor
			 * @param {Object} name
			 * @param {Object} extra
			 */
			sendEvent: function(name, extra) {
				var that = this;

				if (extra) {
					extra = that.isObject(extra) ? extra : {};
				}

				api.sendEvent({
					name: name,
					extra: extra
				});

			},
			/**
			 * @description 向用户发出震动、声音提示、灯光闪烁、状态栏消息等通知，以及闹钟功能
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} notify
			 * @param {Object} alarm
			 * @param {Object} options
			 */
			notification: function(callback, notify, alarm, options) {
				var that = this;
				var o = {};

				if (notify) {
					if (that.isObject(notify) == false) {
						console.error("notify必须是Json对象");
					}
					o.notify = notify;
				}

				if (alarm) {
					if (that.isObject(alarm) == false) {
						console.error("alarm必须是Json对象");
					}
					o.alarm = alarm;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.notification_CONFIG, o, options);

				api.notification(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 取消本应用弹出到状态栏的某个或所有通知，也可以清除设定的闹铃
			 * @constructor
			 * @param {Object} id
			 */
			cancelNotification: function(id) {
				var that = this;

				api.cancelNotification({
					id: id
				});

			},
			/**
			 * @description 调用系统自带定位功能，开始定位
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} isAutoStop
			 */
			startLocation: function(callback, isAutoStop) {
				var that = this;
				isAutoStop = that.isTargetType(isAutoStop, "boolean") ? isAutoStop : true;

				var o = {};
				o.autoStop = isAutoStop;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.startLocation_CONFIG, o, options);

				api.startLocation(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 停止定位服务
			 * @constructor
			 */
			stopLocation: function() {
				var that = this;

				api.stopLocation();

			},
			/**
			 * @description 获取位置信息，获取成功后自动停止获取。
			 * @constructor
			 * @param {Object} callback
			 */
			getLocation: function(callback) {
				var that = this;

				api.getLocation(function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 开启传感器
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} type
			 */
			startSensor: function(callback, type) {
				var that = this;

				api.startSensor({
					type: type
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 停止传感器
			 * @constructor
			 * @param {Object} type
			 */
			stopSensor: function(type) {
				var that = this;

				api.stopSensor({
					type: type
				});

			},
			/**
			 * @description 拨打电话或进行faceTime
			 * @constructor
			 * @param {Object} type
			 * @param {Object} number
			 */
			call: function(type, number) {
				var that = this;
				type = that.isString(type) ? type : "tel_prompt";

				api.call({
					type: type,
					number: number
				});

			},
			/**
			 * @description 调用系统短信界面发送短信，或者后台直接发送短信
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} numbers
			 * @param {Object} text
			 * @param {Object} silent
			 */
			sms: function(callback, numbers, text, silent) {
				var that = this;
				silent = that.isTargetType(silent, "boolean") ? silent : false;

				if (!that.isArray(numbers)) {
					console.error("只接收字符串数组");
				}
				if (numbers.length == 0) {
					console.error("字符串数组至少要有一个字符串号码");
				}

				api.sms({
					numbers: numbers,
					text: text,
					silent: silent
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 发送邮件
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} recipients
			 * @param {Object} subject
			 * @param {Object} body
			 * @param {Object} attachments
			 */
			mail: function(callback, recipients, subject, body, attachments) {
				var that = this;

				var o = {};
				o.recipients = recipients;
				o.subject = subject;
				o.body = body;
				if (attachments) {
					if (!that.isArray(numbers)) {
						console.error("只接收字符串数组");
					}
					if (numbers.length == 0) {
						console.error("字符串数组至少要有一个附件路径");
					}

					o.attachments = attachments;
				}

				api.mail(o, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 打开联系人
			 * @constructor
			 * @param {Object} callback
			 */
			openContacts: function(callback) {
				var that = this;

				api.openContacts(function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 设置是否全屏
			 * @constructor
			 * @param {Object} isFullScreen
			 */
			setFullScreen: function(isFullScreen) {
				var that = this;
				isFullScreen = that.isTargetType(isFullScreen, "boolean") ? isFullScreen : true;

				api.setFullScreen({
					fullScreen: isFullScreen
				});

			},
			/**
			 * @description 设置状态栏样式为白色（适用于深色背景）或黑色（适用于浅色背景），以及设置状态栏背景颜色
			 * @constructor
			 * @param {Object} iosStyle
			 * @param {Object} androidColor
			 */
			setStatusBarStyle: function(iosStyle, androidColor) {
				var that = this;
				var o = {};
				if (that.systemType == "ios" && iosStyle) {
					o.style = iosStyle;
				}
				if (that.systemType == "android" && androidColor) {
					o.color = androidColor;
				}

				api.setStatusBarStyle(o);

			},
			/**
			 * @description 设置屏幕旋转方向
			 * @constructor
			 * @param {Object} orientation
			 */
			setScreenOrientation: function(orientation) {
				var that = this;

				api.setScreenOrientation({
					orientation: orientation
				});

			},
			/**
			 * @description 设置是否禁止屏幕休眠
			 * @constructor
			 * @param {Object} isKeepOn
			 */
			setKeepScreenOn: function(isKeepOn) {
				var that = this;
				isKeepOn = that.isTargetType(isKeepOn, "boolean") ? isKeepOn : true;

				api.setKeepScreenOn({
					keepOn: isKeepOn
				});

			},
			/**
			 * @description 回到系统桌面
			 * @constructor
			 * @constructor
			 */
			toLauncher: function() {
				var that = this;

				api.toLauncher();

			},
			/**
			 * @description 设置是否禁止截屏，只支持Android
			 * @constructor
			 * @param {Object} isSecure
			 */
			setScreenSecure: function(isSecure) {
				var that = this;
				isSecure = that.isTargetType(isSecure, "boolean") ? isSecure : true;

				api.setScreenSecure({
					secure: isSecure
				});

			},
			/**
			 * @description 设置应用图标右上角数字，支持所有 iOS 手机，以及部分 Android 手机，如小米和三星的某些型号，不支持的设备，表现结果为调用该接口无任何效果
			 * @constructor
			 * @param {Object} badge
			 */
			setAppIconBadge: function(badge) {
				var that = this;

				badge = Math.abs(that.isNumber(badge) ? Number(badge) : 0);

				api.setAppIconBadge({
					badge: badge
				});

			},
			/**
			 * @description 获取本机电话号码，只支持 Android 部分手机
			 * @constructor
			 * @param {Object} callback
			 */
			getPhoneNumber: function(callback) {
				var that = this;

				api.getPhoneNumber(function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 弹出带一个按钮的对话框，更多按钮的对话框请使用confirm方法
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} msg
			 * @param {Object} title
			 * @param {Object} buttons
			 */
			alert: function(callback, msg, title, buttons) {
				var that = this;

				if ((!that.isFunction(arguments[0])) && (arguments[0])) {
					msg = arguments[0];
				}
				msg = that.isObject(msg) ? (JSON.stringify(msg)) : msg;

				// 设置提示标题为App名称
				title = title ? title : that.appName;
				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							var _tmp = [];
							_tmp.push(buttons[0]);
							buttons = _tmp;
						} else {
							buttons = ["确定"];
						}
					} else {
						var _tmp = [];
						_tmp.push(buttons[0]);
						buttons = _tmp;
					}
				} else {
					buttons = ["确定"];
				}

				api.alert({
					title: title,
					msg: msg,
					buttons: buttons
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 弹出带两个或三个按钮的confirm对话框
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} title
			 * @param {Object} msg
			 * @param {Object} buttons
			 */
			confirm: function(callback, title, msg, buttons) {
				var that = this;
				msg = that.isObject(msg) ? (JSON.stringify(msg)) : msg;
				title = title ? title : "你确定要执行此操作吗？";
				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							buttons = ["取消"].pop(buttons);
						} else {
							buttons = ["确定", "取消"];
						}
					} else {
						var _buttons = [];
						if (buttons.length == 0) {
							_buttons = ["确定", "取消"];
						} else if (buttons.length == 1) {
							_buttons.push(buttons[0]);
							_buttons.push("取消");
						} else if (buttons.length == 2) {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
						} else {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
							_buttons.push(buttons[2]);
						}
						buttons = _buttons;
					}
				} else {
					buttons = ["确定", "取消"];
				}

				api.confirm({
					title: title,
					msg: msg,
					buttons: buttons
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 弹出带两个或三个按钮和输入框的对话框
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} title
			 * @param {Object} msg
			 * @param {Object} text
			 * @param {Object} type
			 * @param {Object} buttons
			 */
			prompt: function(callback, title, msg, text, type, buttons) {
				var that = this;
				msg = msg ? msg : "请输入值...";
				title = title ? title : "请输入数据后再操作";
				type = type ? type : "text";
				text = text ? text : "";

				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							buttons = ["取消"].pop(buttons);
						} else {
							buttons = ["确定", "取消"];
						}
					} else {
						var _buttons = [];
						if (buttons.length == 0) {
							_buttons = ["确定", "取消"];
						} else if (buttons.length == 1) {
							_buttons.push(buttons[0]);
							_buttons.push("取消");
						} else if (buttons.length == 2) {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
						} else {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
							_buttons.push(buttons[2]);
						}
						buttons = _buttons;
					}
				} else {
					buttons = ["确定", "取消"];
				}

				api.prompt({
					title: title,
					msg: msg,
					text: text,
					type: type,
					buttons: buttons
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 底部弹出框
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} title
			 * @param {Object} buttons
			 * @param {Object} cancelTitle
			 * @param {Object} destructiveTitle
			 * @param {Object} style
			 */
			actionSheet: function(callback, title, buttons, cancelTitle, destructiveTitle, style) {
				var that = this;
				var o = {};

				o.title = title ? title : "请选择你要操作的项";
				o.cancelTitle = cancelTitle ? cancelTitle : "取消";
				if (destructiveTitle) {
					o.destructiveTitle = destructiveTitle;
				}
				if (that.isObject(style)) {
					o.style = style;
				}

				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							buttons = [].push(buttons);
						} else {
							buttons = ["确定"];
						}
					} else {
						if (buttons.length == 0) {
							buttons = ["确定"];
						}
					}
				} else {
					buttons = ["确定"];
				}

				o.buttons = buttons;

				api.actionSheet(o, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 显示进度提示框
			 * @constructor
			 * @param {Object} title
			 * @param {Object} text
			 * @param {Object} isModal
			 * @param {Object} options
			 */
			showProgress: function(title, text, isModal, options) {
				var that = this;
				var o = {};
				o.modal = that.isTargetType(isModal, "boolean") ? isModal : false;
				if (title) {
					o.title = title;
				}
				if (text) {
					o.text = text;
				}

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.showProgress_CONFIG, o, options);

				api.showProgress(opt);

			},
			/**
			 * @description 隐藏进度提示框
			 * @constructor
			 */
			hideProgress: function() {
				var that = this;

				api.hideProgress();

			},
			/**
			 * @description 弹出一个定时自动关闭的提示框
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} msg
			 * @param {Object} duration
			 * @param {Object} location
			 * @param {Object} global
			 */
			toast: function(callback, msg, duration, location, global) {
				var that = this;

				if ((!that.isFunction(arguments[0])) && (arguments[0])) {
					msg = arguments[0];
				}

				msg = that.isObject(msg) ? (JSON.stringify(msg)) : msg;
				duration = Math.abs(that.isNumber(duration) ? Number(duration) : 2000);
				global = that.isBoolean(global) ? global : false;

				var locationArr = ["top", "middle", "bottom"];
				location = location ? location : "bottom";
				location = locationArr.indexOf(location) > -1 ? location : "bottom";

				api.toast({
					msg: msg,
					duration: duration,
					location: location,
					global: global
				});
				if (that.isFunction(callback)) {
					setTimeout(function() {
						callback();
					}, duration);
				}

			},
			/**
			 * @description 打开时间选择器
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} type
			 * @param {Object} date
			 * @param {Object} title
			 */
			openPicker: function(callback, type, date, title) {
				var that = this;
				var o = {};
				var typeArr = ["date", "time", "date_time"];
				type = type ? type : "date_time";
				o.type = typeArr.indexOf(type) > -1 ? type : "date";

				o.title = that.isString(title) ? title : "选择时间";

				if (date) {
					o.date = date;
				}

				api.openPicker(o, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 显示顶部下拉刷新组件，页面必须设置为弹动。
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} options
			 */
			setRefreshHeaderInfo: function(callback, options) {
				var that = this;

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.setRefreshHeaderInfo_CONFIG, options);

				api.setRefreshHeaderInfo(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 显示顶部自定义下拉刷新组件，页面必须设置为弹动。
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} options
			 */
			setCustomRefreshHeaderInfo: function(callback, options) {
				var that = this;

				options = options || {};

				api.setCustomRefreshHeaderInfo(options, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 设置下拉刷新组件为刷新中状态
			 * @constructor
			 */
			refreshHeaderLoading: function() {
				var that = this;

				api.refreshHeaderLoading();

			},
			/**
			 * @description 通知顶部下拉刷新数据加载完毕，组件会恢复到默认状态
			 * @constructor
			 */
			refreshHeaderLoadDone: function() {
				var that = this;

				api.refreshHeaderLoadDone();

			},
			/**
			 * @description 展示一个悬浮框，浮动在屏幕上，点击时关闭当前widget
			 * @constructor
			 * @param {Object} iconPath
			 * @param {Object} duration
			 */
			showFloatBox: function(iconPath, duration) {
				var that = this;

				iconPath = iconPath ? iconPath : 'widget://image/icon.png';
				duration = Math.abs(that.isNumber(duration) ? Number(duration) : 5000);

				api.showFloatBox({
					iconPath: iconPath,
					duration: duration
				});

			},
			/**
			 * @description 通过系统相册或拍照获取图片和视频
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} sourceType
			 * @param {Object} mediaValue
			 * @param {Object} destinationType
			 * @param {Object} options
			 */
			getPicture: function(callback, sourceType, mediaValue, destinationType, options) {
				var that = this;
				var o = {};
				var sourceTypeArr = ["library", "camera", "album"];
				sourceType = sourceType ? sourceType : "library";
				o.sourceType = sourceTypeArr.indexOf(sourceType) > -1 ? sourceType : "library";

				var mediaValueArr = ["pic", "video", "all"];
				mediaValue = mediaValue ? mediaValue : "pic";
				o.mediaValue = mediaValueArr.indexOf(mediaValue) > -1 ? mediaValue : "pic";

				var destinationTypeArr = ["base64", "url"];
				destinationType = destinationType ? destinationType : "url";
				o.destinationType = destinationTypeArr.indexOf(destinationType) > -1 ? destinationType : "url";

				options = options || {};
				var opt = that.extendObj(that.DEFAULT_CONFIG.getPicture_CONFIG, o, options);

				api.getPicture(opt, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 保存图片和视频到系统相册
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} path
			 */
			saveMediaToAlbum: function(callback, path) {
				var that = this;

				api.saveMediaToAlbum({
					path: path
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 录制amr格式音频
			 * @constructor
			 * @param {Object} path
			 */
			startRecord: function(path) {
				var that = this;

				api.startRecord({
					path: path
				});

			},
			/**
			 * @description 停止录音
			 * @constructor
			 * @param {Object} callback
			 */
			stopRecord: function(callback) {
				var that = this;

				api.stopRecord(function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 开始播放音频
			 * @constructor
			 * @param {Object} path
			 * @param {Object} callback
			 */
			startPlay: function(path, callback) {
				var that = this;

				api.startPlay({
					path: path
				}, function(ret, err) {
					if (that.isFunction(callback)) {
						callback(ret, err);
					}
				});

			},
			/**
			 * @description 停止播放音频
			 * @constructor
			 */
			stopPlay: function() {
				var that = this;

				api.stopPlay();

			},
			/**
			 * @description 打开系统视频播放器
			 * @constructor
			 * @param {Object} url
			 */
			openVideo: function(url) {
				var that = this;

				api.openVideo({
					url: url
				});

			},
			/**
			 * @description 函数初始化
			 * @constructor
			 * @param {Object} callback
			 */
			ready: function(callback) {
				var that = this;
				var host = window.location.host;
				var path = window.location.href;

				apiready = function() {
					if (that.isFunction(callback)) {
						callback();
					}
				};

			},
			/**
			 * @description 模块导入
			 * @constructor
			 * @param {Sting} modules
			 */
			require: function(modules) {
				return  api.require(modules);
			},
			// ######################### 常用语法糖
			/**
			 * @description 快捷打开子窗口
			 * @constructor
			 * @param {Object} frameName
			 * @param {Object} frameUrl
			 * @param {Object} headerSelector
			 * @param {Object} framePageParam
			 * @param {Object} footerSelector
			 * @param {Object} options
			 */
			openFrameNavOrFoot: function(frameName, frameUrl, headerSelector, framePageParam, footerSelector, options) {
				var that = this;

				var footerOffset = that.offset(footerSelector);
				that.fixStatusBar(function(offset) {
					var _options = {
						rect: {
							x: 0,
							y: offset.h,
							h: that.winHeight - offset.h - footerOffset.h,
							w: that.winWidth
						}
					};

					options = options || {};
					var opt = that.extendObj(_options, options);
					that.openFrame(frameName, frameUrl, framePageParam, opt);

				}, headerSelector);
			},
			/**
			 * @description 快捷打开子窗口组
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} groupName
			 * @param {Object} frames
			 * @param {Object} index
			 * @param {Object} headerSelector
			 * @param {Object} footerSelector
			 * @param {Object} options
			 */
			openFrameGroupNavOrFoot: function(callback, groupName, frames, index, headerSelector, footerSelector, options) {
				var that = this;
				var footerOffset = that.offset(footerSelector);
				that.fixStatusBar(function(offset) {
					options = options || {};
					options.rect = {
						x: 0,
						y: offset.h,
						h: that.winHeight - offset.h - footerOffset.h,
						w: that.winWidth
					};
					that.openFrameGroup(callback, groupName, frames, index, options);
				}, headerSelector);
			},
			/**
			 * @description 浏览器打开连接
			 * @constructor
			 * @param {Object} url
			 * @param {Object} appParam
			 */
			openBrowser: function(url, appParam) {
				var that = this;

				that.openApp(null, url, appParam);
			},
			/**
			 * @description 双击关闭app
			 * @constructor
			 * @param {Object} callback
			 */
			dblclickToCloseApp: function(callback) {
				var that = this;

				var mkeyTime = new Date().getTime();
				that.keyback(function(ret, err) {
					if ((new Date().getTime() - mkeyTime) > 2000) {
						mkeyTime = new Date().getTime();
						that.toast(null, '再按一次退出' + that.appName, 2000);
					} else {
						if (that.isFunction(callback)) {
							callback();
						}
						setTimeout(function() {
							that.closeWidget(null, null, {
								silent: true
							});
						}, 300);
					}
				});
			},
			/**
			 * @description 底部按钮切换
			 * @constructor
			 * @param {Object} framesOptionsWithHeaderSelector
			 * @param {Object} hideHeaderClassName
			 * @param {Object} footerSelector
			 * @param {Object} triggerSelectorByFooter
			 * @param {Object} triggerActiveClasses
			 * @param {Object} defaultIndex
			 */
			openFrameIndexByClick: function(framesOptionsWithHeaderSelector, hideHeaderClassName, footerSelector, triggerSelectorByFooter, triggerActiveClasses, defaultIndex) {
				var that = this;
				defaultIndex = that.isNumber(defaultIndex) ? Math.abs(defaultIndex) : 0;
				// 内部切换
				function swiperPage(_index) {
					// 显示对应的头部和底部高亮样式
					if (framesOptionsWithHeaderSelector && framesOptionsWithHeaderSelector.length > 0) {
						var currentFrame = null;
						var openedFrameArr = [];
						for (var i = 0; i < framesOptionsWithHeaderSelector.length; i++) {
							currentFrame = framesOptionsWithHeaderSelector[i];
							if (_index == i) {
								that.removeClass(that.D(currentFrame.header), hideHeaderClassName);
								that.addClass(that.D(footerSelector + " " + triggerSelectorByFooter + ":nth-child(" + (i + 1) + ")"), triggerActiveClasses);

								if (openedFrameArr.indexOf(currentFrame.name) > -1) {
									that.setFrameAttr(currentFrame.name, false);
								} else {
									that.openFrameNavOrFoot(currentFrame.name, currentFrame.url, currentFrame.header, that.pageParam, footerSelector, currentFrame);
									openedFrameArr.push(currentFrame.name);
								}
							} else {
								that.setFrameAttr(currentFrame.name, true);
								that.addClass(that.D(currentFrame.header), hideHeaderClassName);
								that.removeClass(that.D(footerSelector + " " + triggerSelectorByFooter + ":nth-child(" + (i + 1) + ")"), triggerActiveClasses);
							}
						}
					}
				}

				swiperPage(defaultIndex);

				// 绑定底部点击切换事件
				that.on(that.Ds(footerSelector + " " + triggerSelectorByFooter), "touchstart", function(event) {
					var triggerElement = that.getParents(event.target, that.getClassOrTagName(triggerSelectorByFooter));
					var _index = that.getIndex(triggerElement);
					swiperPage(_index);
				});

			},
			/**
			 * @description 窗口组点击切换
			 * @constructor
			 * @param {Object} callback
			 * @param {Object} groupName
			 * @param {Object} framesOptionsWithHeaderSelector
			 * @param {Object} defaultIndex
			 * @param {Object} isScroll
			 * @param {Object} hideHeaderClassName
			 * @param {Object} footerSelector
			 * @param {Object} triggerSelectorByFooter
			 * @param {Object} triggerActiveClasses
			 * @param {Object} options
			 */
			openFrameGroupIndexByClick: function(callback, groupName, framesOptionsWithHeaderSelector, defaultIndex, isScroll, hideHeaderClassName, footerSelector, triggerSelectorByFooter, triggerActiveClasses, options) {
				var that = this;
			},
			/**
			 * @description 快速
			 * @param {Object} callback
			 * @param {Object} options
			 */
			getPictureWithCamera: function(callback, options) {
				var that = this;
				that.actionSheet(function(ret, err) {
					switch (ret.buttonIndex) {
						case 1:
							that.getPicture(callback, "album", "pic", "url", options);
							break;
						case 2:
							that.getPicture(callback, "camera", "pic", "url", options);
							break;
					}
				}, "请选择图片来源", ["相册选取", "相机拍摄"]);
			},
			// ######################### 自定义
			returnElement: function(cssSelectorOrElement) {
				var that = this;
				if (that.isElement(cssSelectorOrElement)) {
					return cssSelectorOrElement;
				} else {
					return that.D(cssSelectorOrElement);
				}
			},
			D: function(cssSelectorOrElement, parentSelectorOrElement) {
				var that = this;
				parentSelectorOrElement = parentSelectorOrElement ? parentSelectorOrElement : document;
				parentSelectorOrElement = that.isString(parentSelectorOrElement) ? document.querySelector(parentSelectorOrElement) : parentSelectorOrElement;

				return parentSelectorOrElement.querySelector(cssSelectorOrElement);
			},
			Ds: function(cssSelectorOrElement, parentSelectorOrElement) {
				var that = this;
				parentSelectorOrElement = parentSelectorOrElement ? parentSelectorOrElement : document;
				parentSelectorOrElement = that.isString(parentSelectorOrElement) ? document.querySelector(parentSelectorOrElement) : parentSelectorOrElement;

				return parentSelectorOrElement.querySelectorAll(cssSelectorOrElement);
			},
			// 根据数字返回对应键码
			getWordByIndex: function(number) {
				return String.fromCharCode(number).toLocaleUpperCase();
			},
			on: function(elements, eventType, callback, useCapture) {
				var that = this;
				useCapture = useCapture || false;
				if (that.isElements(elements)) {
					if (elements.length > 0) {
						for (var i = 0; i < elements.length; i++) {
							elements[i].addEventListener(eventType, function(event) {
								if (that.isFunction(callback)) {
									callback(event);
								}
							}, useCapture);
						}
					}
				} else {
					elements.addEventListener(eventType, function(event) {
						if (that.isFunction(callback)) {
							callback(event);
						}
					}, useCapture);
				}
			},
			off: function(elements, eventType, callback, useCapture) {
				var that = this;
				useCapture = useCapture || false;
				if (that.isElements(elements)) {
					if (elements.length > 0) {
						for (var i = 0; i < elements.length; i++) {
							elements[i].removeEventListener(eventType, function(event) {
								if (that.isFunction(callback)) {
									callback(event);
								}
							}, useCapture);
						}
					}
				} else {
					elements.removeEventListener(eventType, function(event) {
						if (that.isFunction(callback)) {
							callback(event);
						}
					}, useCapture);
				}
			},
			one: function(elements, eventType, callback, useCapture) {
				var that = this;

				var fn = function(event) {
					callback && callback();
					that.off(elements, eventType, callback, useCapture);
				};

				that.on(elements, eventType, fn, useCapture);
			},
			animationEventEnd: function(cssSelectorOrElement, callback) {
				var that = this;
				var elem = that.returnElement(cssSelectorOrElement);
				that.on(elem, "webkitAnimationEnd", callback);
			},
			domLoadEventEnd: function(callback) {
				var that = this;
				that.on(document, "DOMContentLoaded", callback);
			},
			domInsertedEvent: function(callback) {
				var that = this;
				that.on(document, "DOMNodeInserted", callback);
			},
			domModifiedEvent: function(callback) {
				var that = this;
				that.on(document, "DOMAttrModified", callback);
			},
			domRemovedEvent: function(callback) {
				var that = this;
				that.on(document, "DOMNodeRemoved", callback);
			},
			// 返回滑动的角度
			// dx表示开始的pageX减去结束的pageX
			// dy表示开始的pageY减去结束的pageY
			GetSlideAngle: function(dx, dy) {
				return Math.atan2(dy, dx) * 180 / Math.PI;
			},
			//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
			GetSlideDirection: function(startX, startY, endX, endY) {
				var that = this;

				var dy = startY - endY;
				var dx = endX - startX;
				var result = 0;
				//如果滑动距离太短
				if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
					return result;
				}
				var angle = that.GetSlideAngle(dx, dy);
				if (angle >= -45 && angle < 45) {
					result = 4;
				} else if (angle >= 45 && angle < 135) {
					result = 1;
				} else if (angle >= -135 && angle < -45) {
					result = 2;
				} else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
					result = 3;
				}
				return result;
			},
			prepend: function(cssSelectorOrElement, parentSelectorOrElement, htmlOrElement) {
				var that = this;
				var selectors = [];

				if (that.isElements(cssSelectorOrElement)) {
					selectors = cssSelectorOrElement;
				} else {
					if (that.isElement(cssSelectorOrElement)) {
						selectors.push(cssSelectorOrElement);
					} else {
						selectors = that.Ds(cssSelectorOrElement, parentSelectorOrElement);
					}
				}
				if (selectors.length > 0) {
					for (var i = 0; i < selectors.length; i++) {
						if (that.isElement(htmlOrElement)) {
							selectors[i].insertAdjacentElement('afterbegin', htmlOrElement);
						} else {
							selectors[i].insertAdjacentHTML('afterbegin', htmlOrElement);
						}
					}
				}
			},
			append: function(cssSelectorOrElement, parentSelectorOrElement, htmlOrElement) {
				var that = this;
				var selectors = [];

				if (that.isElements(cssSelectorOrElement)) {
					selectors = cssSelectorOrElement;
				} else {
					if (that.isElement(cssSelectorOrElement)) {
						selectors.push(cssSelectorOrElement);
					} else {
						selectors = that.Ds(cssSelectorOrElement, parentSelectorOrElement);
					}
				}
				if (selectors.length > 0) {
					for (var i = 0; i < selectors.length; i++) {
						if (that.isElement(htmlOrElement)) {
							selectors[i].insertAdjacentElement('beforeend', htmlOrElement);
						} else {
							selectors[i].insertAdjacentHTML('beforeend', htmlOrElement);
						}
					}
				}
			},
			before: function(cssSelectorOrElement, parentSelectorOrElement, htmlOrElement) {
				var that = this;
				var selectors = [];

				if (that.isElements(cssSelectorOrElement)) {
					selectors = cssSelectorOrElement;
				} else {
					if (that.isElement(cssSelectorOrElement)) {
						selectors.push(cssSelectorOrElement);
					} else {
						selectors = that.Ds(cssSelectorOrElement, parentSelectorOrElement);
					}
				}
				if (selectors.length > 0) {
					for (var i = 0; i < selectors.length; i++) {
						if (that.isElement(htmlOrElement)) {
							selectors[i].insertAdjacentElement('beforebegin', htmlOrElement);
						} else {
							selectors[i].insertAdjacentHTML('beforebegin', htmlOrElement);
						}
					}
				}
			},
			after: function(cssSelectorOrElement, parentSelectorOrElement, htmlOrElement) {
				var that = this;
				var selectors = [];

				if (that.isElements(cssSelectorOrElement)) {
					selectors = cssSelectorOrElement;
				} else {
					if (that.isElement(cssSelectorOrElement)) {
						selectors.push(cssSelectorOrElement);
					} else {
						selectors = that.Ds(cssSelectorOrElement, parentSelectorOrElement);
					}
				}
				if (selectors.length > 0) {
					for (var i = 0; i < selectors.length; i++) {
						if (that.isElement(htmlOrElement)) {
							selectors[i].insertAdjacentElement('afterend', htmlOrElement);
						} else {
							selectors[i].insertAdjacentHTML('afterend', htmlOrElement);
						}
					}
				}
			},
			cssValue: function(cssSelectorOrElement, propName) {
				var that = this;
				var elem = that.returnElement(cssSelectorOrElement);
				var computedStyle = window.getComputedStyle(elem, null);
				return computedStyle.getPropertyValue(propName);
			},
			getParents: function(element, className) {
				var that = this;
				var returnParentElement = null;

				function getParentNode(element, className) {
					if (that.isElement(element)) {
						if (element && element.classList.contains(className) && element.tagName.toLowerCase() != "body") {
							returnParentElement = element;
						} else {
							getParentNode(element.parentElement, className);
						}
					}
				}

				getParentNode(element, className);

				return returnParentElement;
			},
			cssText: function(cssSelectorOrElement, cssString, parentSelectorOrElement) {
				var that = this;
				var selectors = [];

				if (that.isElements(cssSelectorOrElement)) {
					selectors = cssSelectorOrElement;
				} else {
					if (that.isElement(cssSelectorOrElement)) {
						selectors.push(cssSelectorOrElement);
					} else {
						selectors = that.Ds(cssSelectorOrElement, parentSelectorOrElement);
					}
				}
				if (selectors.length > 0) {
					for (var i = 0; i < selectors.length; i++) {
						selectors[i].style.cssText = cssString;
					}
				}
			},
			siblings: function(cssSelectorOrElement) {
				var that = this;

				var elem = that.returnElement(cssSelectorOrElement);
				var r = [];
				var n = elem.parentNode.firstChild;
				for (; n; n = n.nextSibling) {
					if (n.nodeType === 1 && n !== elem) {
						r.push(n);
					}
				}
				return r;
			},
			scrollToElement: function(cssSelectorOrElement, targetCssSelectorOrElement) {
				var that = this;
				var elem = that.returnElement(cssSelectorOrElement);
				var targetElem = that.returnElement(targetCssSelectorOrElement);
				elem.scrollTop = targetElem.offsetTop + document.documentElement.scrollTop;
			},
			siblingsContainSelf: function(cssSelectorOrElement) {
				var that = this;

				var elem = that.returnElement(cssSelectorOrElement);
				var r = [];
				var n = elem.parentNode.firstChild;
				for (; n; n = n.nextSibling) {
					if (n.nodeType === 1) {
						r.push(n);
					}
				}
				return r;
			},
			addClass: function(elements, classs) {
				var that = this;

				if (that.isElements(elements)) {
					if (elements.length > 0) {
						for (var i = 0; i < elements.length; i++) {
							if (classs.indexOf(',') > -1) {
								var _classArr = classs.split(",");
								for (var j = 0; j < _classArr.length; j++) {
									if (_classArr[j] != "") {
										elements[i].classList.add(_classArr[j]);
									}
								}
							} else {
								if (classs.indexOf(' ') > -1) {
									var _classArr = classs.split(" ");
									for (var j = 0; j < _classArr.length; j++) {
										if (_classArr[j] != "") {
											elements[i].classList.add(_classArr[j]);
										}
									}
								} else {
									elements[i].classList.add(classs);
								}
							}
						}
					}
				} else {
					if (classs.indexOf(',') > -1) {
						var _classArr = classs.split(",");
						for (var i = 0; i < _classArr.length; i++) {
							if (_classArr[i] != "") {
								elements.classList.add(_classArr[i]);
							}
						}
					} else {
						if (classs.indexOf(' ') > -1) {
							var _classArr = classs.split(" ");
							for (var i = 0; i < _classArr.length; i++) {
								if (_classArr[i] != "") {
									elements.classList.add(_classArr[i]);
								}
							}
						} else {
							elements.classList.add(classs);
						}
					}
				}
			},
			removeClass: function(elements, classs) {
				var that = this;

				if (that.isElements(elements)) {
					if (elements.length > 0) {
						for (var i = 0; i < elements.length; i++) {
							if (classs.indexOf(',') > -1) {
								var _classArr = classs.split(",");
								for (var j = 0; j < _classArr.length; j++) {
									if (_classArr[j] != "") {
										elements[i].classList.remove(_classArr[j]);
									}
								}
							} else {
								if (classs.indexOf(' ') > -1) {
									var _classArr = classs.split(" ");
									for (var j = 0; j < _classArr.length; j++) {
										if (_classArr[j] != "") {
											elements[i].classList.remove(_classArr[j]);
										}
									}
								} else {
									elements[i].classList.remove(classs);
								}
							}
						}
					}
				} else {
					if (classs.indexOf(',') > -1) {
						var _classArr = classs.split(",");
						for (var i = 0; i < _classArr.length; i++) {
							if (_classArr[i] != "") {
								elements.classList.remove(_classArr[i]);
							}
						}
					} else {
						if (classs.indexOf(' ') > -1) {
							var _classArr = classs.split(" ");
							for (var i = 0; i < _classArr.length; i++) {
								if (_classArr[i] != "") {
									elements.classList.remove(_classArr[i]);
								}
							}
						} else {
							elements.classList.remove(classs);
						}
					}
				}
			},
			hasClass: function(cssSelectorOrElement, _class) {
				var that = this;
				var element = that.returnElement(cssSelectorOrElement);
				return element.classList.contains(_class);
			},
			getIndex: function(ele) {
				var a = [];

				if (ele && ele.nodeType && ele.nodeType == 1) {
					var oParent = ele.parentNode;
					var oChilds = oParent.childNodes;
					var _childs = [];
					for (var i = 0; i < oChilds.length; i++) {
						if (oChilds[i] && oChilds[i].nodeType && oChilds[i].nodeType == 1) {
							_childs.push(oChilds[i]);
						}
					}

					for (var i = 0; i < _childs.length; i++) {
						if (_childs[i] == ele) {
							return i;
						}
					}
				} else {
					return -1;
				}
			},
			offset: function(cssSelectorOrElement) {
				var that = this;
				var element = that.returnElement(cssSelectorOrElement);
				if (!that.isElement(element)) {
					return {
						l: 0,
						t: 0,
						w: 0,
						h: 0
					};
				} else {
					var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
					var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

					var rect = element.getBoundingClientRect();
					return {
						l: rect.left + sl,
						t: rect.top + st,
						w: element.offsetWidth,
						h: element.offsetHeight
					};
				}
			},
			jsonToStr: function(json) {
				var that = this;
				if (that.isObject(json)) {
					return JSON && JSON.stringify(json);
				}
			},
			strToJson: function(str) {
				var that = this;
				if (that.isString(str)) {
					return JSON && JSON.parse(str);
				}
			},
			uzStorage: function() {
				var ls = window.localStorage;
				if ((/android/gi).test(navigator.appVersion)) {
					ls = os.localStorage();
				}
				return ls;
			},
			setStorage: function(key, value) {
				var that = this;
				if (arguments.length === 2) {
					var v = value;
					if (that.isObject(v)) {
						v = JSON.stringify(v);
						v = 'obj-' + v;
					} else {
						v = 'str-' + v;
					}
					var ls = that.uzStorage();
					if (ls) {
						ls.setItem(key, v);
					}
				}
			},
			getStorage: function(key) {
				var that = this;

				var ls = that.uzStorage();
				if (ls) {
					var v = ls.getItem(key);
					if (!v) {
						return;
					}
					if (v.indexOf('obj-') === 0) {
						v = v.slice(4);
						return JSON.parse(v);
					} else if (v.indexOf('str-') === 0) {
						return v.slice(4);
					}
				}
			},
			rmStorage: function(key) {
				var that = this;

				var ls = that.uzStorage();
				if (ls && key) {
					ls.removeItem(key);
				}
			},
			clearStorage: function() {
				var that = this;

				var ls = that.uzStorage();
				if (ls) {
					ls.clear();
				}
			},
			fixIos7Bar: function(cssSelectorOrElement) {
				var that = this;
				var element = that.returnElement(cssSelectorOrElement);
				if (!that.isElement(element)) {
					console.warn('没有找到DOM元素');
				}

				var strDM = that.systemType;
				if (strDM == 'ios') {
					var strSV = that.systemVersion;
					var numSV = parseInt(strSV, 10);
					var fullScreen = that.fullScreen;
					var iOS7StatusBarAppearance = that.iOS7StatusBarAppearance;
					if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
						element.style.paddingTop = '20px';
					}
				}
			},
			fixStatusBar: function(callback, cssSelectorOrElement) {
				var that = this;

				var element = that.returnElement(cssSelectorOrElement);
				if (!that.isElement(element)) {
					console.error('没有找到DOM元素');
				}

				var sysType = that.systemType;
				if (sysType == 'ios') {
					that.fixIos7Bar(element);
				} else if (sysType == 'android') {
					var ver = that.systemVersion;
					ver = parseFloat(ver);
					if (ver >= 4.4) {
						element.style.paddingTop = '25px';
					}
				}

				var _offset = that.offset(element);
				if (that.isFunction(callback)) {
					callback(_offset);
				}
			},
			scrollToDocButton: function() {
				var that = this;
				that.D("body").scrollTop = that.D("body").scrollHeight;
			},
			getScroll: function() {
				var t, l, w, h;
				if (document.documentElement && document.documentElement.scrollTop) {
					t = document.documentElement.scrollTop;
					l = document.documentElement.scrollLeft;
					w = document.documentElement.scrollWidth;
					h = document.documentElement.scrollHeight;
				} else if (document.body) {
					t = document.body.scrollTop;
					l = document.body.scrollLeft;
					w = document.body.scrollWidth;
					h = document.body.scrollHeight;
				}
				return {
					t: t,
					l: l,
					w: w,
					h: h
				};
			},
			// #################### 自定义UI组件
			dialogCore: function(type, title, msg, buttons) {

				var that = this;
				title = title ? title : "温馨提示：";
				var clientWidth = window.document.body.clientWidth;

				var contentHtml = "";
				contentHtml += '<div class="Y-dialog Y-theme-background-color-white animated zoomIn" style="-webkit-animation-duration: 0.3s; animation-duration: 0.3s;width: ' + (clientWidth - 50) + 'px; min-height: 80px;">';
				contentHtml += '<div class="Y-dialog-title Y-padding-10 Y-font-size-16 Y-line-height-normal" style="background: #f4f4f4;">' + title + '</div>';
				contentHtml += '<div class="Y-dialog-content Y-padding-10 Y-word-break-break-all Y-font-size-16 Y-theme-font-color-666">' + msg + '</div>';
				contentHtml += '<div class="Y-dialog-buttons Y-flexbox-horizontal Y-border-vertical-top-after">';

				if (buttons && buttons.length > 0) {
					for (var i = 0; i < buttons.length; i++) {
						if (i == (buttons.length - 1) && buttons.length > 1) {
							contentHtml += '<div class="Y-dialog-button Y-flex-item Y-font-size-16 Y-padding-10 Y-center-all Y-touch-active Y-theme-font-color1">' + buttons[i] + '</div>';
						} else {
							contentHtml += '<div class="Y-dialog-button Y-border-horizontal-right-after Y-flex-item Y-font-size-16 Y-padding-10 Y-center-all Y-touch-active Y-theme-font-color9">' + buttons[i] + '</div>';
						}
					}
				}
				contentHtml += '</div>';
				contentHtml += '</div>';

				if (that.Ds(".Y-dialog-area") && that.Ds(".Y-dialog-area").length > 0) {
					that.D(".Y-dialog-area").innerHTML = contentHtml;
				} else {
					var html = "";
					html += '<div class="Y-dialog-area Y-display-none-important Y-position-absolute Y-vertical-top-0 Y-center-all Y-horizontal-right-0 Y-vertical-bottom-0 Y-horizontal-left-0 Y-background-color-transparent-3" style="z-index:1234567890123">';
					html += contentHtml;
					html += '</div>';
					that.prepend(document.body, null, html);
				}

				var scrollObj = that.getScroll();
				that.D(".Y-dialog-area").style.height = window.innerHeight + scrollObj.t + "px";
				that.D(".Y-dialog").style.marginTop = scrollObj.t + "px";

				window.onscroll = function(event) {
					setTimeout(function() {
						var scrollObj = that.getScroll();
						that.D(".Y-dialog-area").style.height = window.innerHeight + scrollObj.t + "px";
						that.D(".Y-dialog").style.marginTop = scrollObj.t + "px";
					}, 10);
				};
			},
			// 下拉选择
			selectTip: function(element, items, okCallback, cancelCallback) {
				var that = this;
				if (that.Ds(".Y-select-area") && that.Ds(".Y-select-area").length > 0) {
					document.body.removeChild(that.D(".Y-select-area"));
				}

				var html = '<div class="Y-select-area Y-display-none-important Y-flexbox-vertical Y-background-color-transparent-3 Y-position-fixed Y-vertical-top-0 Y-horizontal-right-0 Y-horizontal-left-0 Y-vertical-bottom-0 Y-horizontal-right-0 Y-width-100-percent Y-overflow-hidden Y-height-100-percent">';
				html += '<div class="Y-select-space Y-flex-item"></div>';
				html += '<div class="Y-select-list Y-flexbox-vertical Y-position-relative animated flipInY">';
				html += '<div class="Y-select-button Y-theme-background-color-white Y-height-45 Y-padding-horizontal-both-10 Y-font-size-16">';
				html += '<span class="Y-display-inline-block Y-float-left Y-select-cancel">取消</span>';
				html += '<span class="Y-display-inline-block Y-float-right Y-theme-font-color9 Y-select-ok">确定</span>';
				html += '</div>';
				html += '<div class="Y-select-options Y-flex-item  Y-theme-background-color-eee Y-overflow-hidden Y-position-relative">';
				html += '<div class="Y-select-items">';
				if (items && items.length > 0) {
					for (var i = 0; i < items.length; i++) {
						html += '<div class="Y-select-item Y-font-size-16 Y-theme-font-color-black Y-center-all Y-height-45">' + items[i] + '</div>';
					}
				} else {
					html += '<div class="Y-select-item Y-font-size-16 Y-theme-font-color-black Y-center-all Y-height-45">请选择</div>';
				}
				html += '</div>';
				html += '<div class="Y-select-check Y-position-absolute Y-box-sizing-border-box Y-height-45 Y-width-100-percent Y-position-center-all"></div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';

				that.prepend(document.body, null, html);
				that.removeClass(that.D('.Y-select-area'), "Y-display-none-important");

				var items = that.D(".Y-select-items");
				var options = that.D(".Y-select-options");
				// 是否点击取消按钮
				var isCancel = false;
				// 初始化方向
				var direction = 1;
				// 初始坐标
				var startX = 0,
					startY = 0;
				// 当前Y轴位移
				var currentTranslateY = 0;
				// 每一个列表项目高度
				var itemHeight = 45;
				// 列表项目个数
				var itemSize = that.Ds(".Y-select-item", items).length;
				// 滑动区域的偏移量
				var itemsOffset = that.offset(items);
				// 当前选择索引
				var currentSelectIndex = 0;
				// 当前选择中的值
				var currentSelectValue = "";
				// 默认下移两个列表项目高度
				that.cssText(items, "transform:translateY(" + (2 * itemHeight) + "px);-webkit-transform:translateY(" + (2 * itemHeight) + "px); transition:transform 0.3s;-webkit-transition:transform 0.3s;");
				// 默认第一个高亮
				that.cssText(that.D(".Y-select-item:nth-child(1)", items), "font-size:1.8rem;color:#f00;transition: font-size 0.2s;-webkit-transition: font-size 0.2s;");

				// 绑定触摸事件
				that.on(options, "touchstart", function(event) {
					if (event.targetTouches.length == 1) {
						var touch = event.targetTouches[0];
						startX = touch.clientX;
						startY = touch.clientY;
						currentTranslateY = Number(items.style.WebkitTransform.replace(/translateY\(/g, "").replace(/px\)/g, ""));
					}
				});
				that.on(options, "touchmove", function(event) {
					if (event.targetTouches.length == 1) {
						var touch = event.targetTouches[0];
						event.preventDefault();
						// 滑动距离
						var scrollRange = touch.clientY - startY + currentTranslateY;
						that.cssText(items, "transform:translateY(" + scrollRange + "px);-webkit-transform:translateY(" + scrollRange + "px);");

						direction = that.GetSlideDirection(startX, startY, touch.clientX, touch.clientY);

						// 向上
						if (direction == 1) {
							if (scrollRange - itemHeight * 2 < -((itemSize - 2)) * itemHeight) {
								currentSelectIndex = itemSize - 1;
							} else {
								currentSelectIndex = Math.abs(Math.round((scrollRange - itemHeight * 2) / itemHeight));
							}
						}
						// 向下
						if (direction == 2) {
							if (scrollRange > itemHeight * 2) {
								currentSelectIndex = 0;
							} else {
								currentSelectIndex = Math.abs(Math.round((scrollRange - itemHeight * 2) / itemHeight));
							}
						}
						var currentItem = that.D(".Y-select-item:nth-child(" + (currentSelectIndex + 1) + ")", items);
						that.cssText(currentItem, "font-size:1.8rem;color:#f00;transition: font-size 0.2s;-webkit-transition: font-size 0.2s;");
						that.cssText(that.siblings(currentItem), "font-size:1.6rem;color:#000;transition: font-size 0.2s;-webkit-transition: font-size 0.2s;");
					}
				});
				that.on(options, "touchend", function(event) {
					that.cssText(items, "transition: transform 0.2s;-webkit-transition: transform 0.2s;-webkit-transform:translateY(" + (itemHeight * 2 - currentSelectIndex * itemHeight) + "px);");
				});

				// 取消按钮
				that.on(that.Ds(".Y-select-cancel,.Y-select-space"), "touchend", function(event) {
					isCancel = true;
					currentSelectValue = that.D(".Y-select-item:nth-child(" + (currentSelectIndex + 1) + ")").innerText;
					that.cssText(that.D('.Y-select-list'), "-webkit-animation-duration: 0.4s; animation-duration: 0.4s;");
					that.addClass(that.D('.Y-select-list'), 'slideOutDown');
				});

				// 确定按钮
				that.on(that.D(".Y-select-ok"), "touchend", function(event) {
					isCancel = false;
					currentSelectValue = that.D(".Y-select-item:nth-child(" + (currentSelectIndex + 1) + ")").innerText;
					that.cssText(that.D('.Y-select-list'), "-webkit-animation-duration: 0.4s; animation-duration: 0.4s;");
					that.addClass(that.D('.Y-select-list'), 'slideOutDown');
				});

				that.animationEventEnd(".Y-select-list", function(event) {
					if (that.hasClass(that.D('.Y-select-area'), "Y-display-none-important") == false) {
						that.removeClass(that.D('.Y-select-list'), 'flipInY');
					}
					if (that.hasClass(that.D('.Y-select-list'), 'slideOutDown')) {
						that.addClass(that.D('.Y-select-area'), "Y-display-none-important");
						if (isCancel == true) {
							if (that.isFunction(cancelCallback)) {
								cancelCallback(currentSelectIndex, currentSelectValue);
							}
						} else {
							if (that.isElement(element)) {
								element.value = currentSelectValue;
							}
							if (that.isFunction(okCallback)) {
								okCallback(currentSelectIndex, currentSelectValue);
							}
						}
					}
				});
			},
			actionSheetTip: function(callback, title, buttons, cancelTitle, destructiveTitle, style) {
				var that = this;
				var o = {};

				o.title = title ? title : "请选择你要操作的项";
				o.cancelTitle = cancelTitle ? cancelTitle : "取消";
				if (destructiveTitle) {
					o.destructiveTitle = destructiveTitle;
				}
				if (that.isObject(style)) {
					o.style = style;
				}

				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							buttons = [].push(buttons);
						} else {
							buttons = ["确定"];
						}
					} else {
						if (buttons.length == 0) {
							buttons = ["确定"];
						}
					}
				} else {
					buttons = ["确定"];
				}

				o.buttons = buttons;

				if (that.Ds(".Y-actionSheet") && that.Ds(".Y-actionSheet").length > 0) {
					document.body.removeChild(that.D(".Y-actionSheet"));
				}

				var html = '<div class="Y-actionSheet Y-display-none-important Y-flexbox-vertical Y-position-absolute Y-vertical-top-0 Y-horizontal-right-0 Y-vertical-bottom-0 Y-horizontal-left-0 Y-height-100-percent Y-width-100-percent Y-background-color-transparent-3" style="z-index: 19923015; ">';
				html += '<div class="Y-actionSheet-space Y-flex-item"></div>';
				html += '<div class="Y-actionSheet-list Y-padding-10 animated slideInUp" style="-webkit-animation-duration:0.4s;animation-duration:0.4s;">';
				html += '<div class="Y-actionSheet-title">';
				html += '<div class="Y-actionSheet-item Y-theme-background-color-white  Y-text-show-row-1 Y-border-vertical-bottom-after Y-padding-10 Y-center-all Y-font-size-14 Y-theme-font-color-999">' + o.title + '</div>';
				html += '</div>';
				html += '<div class="Y-actionSheet-buttons">';

				for (var i = 0; i < o.buttons.length; i++) {
					html += '<div class="Y-actionSheet-item Y-theme-background-color-white Y-touch-active Y-border-vertical-bottom-after Y-text-show-row-1 Y-padding-10 Y-center-all Y-font-size-14 Y-theme-font-color1">' + o.buttons[i] + '</div>';
				}

				html += '</div>';
				html += '<div class="Y-actionSheet-cancel Y-margin-vertical-top-10">';
				html += '<div class="Y-actionSheet-item Y-theme-background-color-white Y-touch-active  Y-text-show-row-1 Y-padding-10 Y-center-all Y-font-size-14 Y-theme-font-color1" tapmode="">' + o.cancelTitle + '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';

				that.prepend(document.body, null, html);
				that.removeClass(that.D('.Y-actionSheet'), "Y-display-none-important");

				var _ret = {};
				that.on(that.Ds('.Y-actionSheet-buttons .Y-actionSheet-item'), "touchend", function(event) {
					var _index = that.getIndex(that.getParents(event.target, "Y-actionSheet-item"));
					_ret.buttonIndex = _index + 1;
					that.addClass(that.D('.Y-actionSheet-list'), 'slideOutDown');
				});

				that.on(that.Ds('.Y-actionSheet-cancel .Y-actionSheet-item'), "touchend", function(event) {
					that.addClass(that.D('.Y-actionSheet-list'), 'slideOutDown');
					_ret.buttonIndex = that.Ds('.Y-actionSheet-buttons .Y-actionSheet-item').length + 1;
				});

				that.animationEventEnd(".Y-actionSheet-list", function(event) {
					if (that.hasClass(that.D('.Y-actionSheet'), "Y-display-none-important") == false) {
						that.removeClass(that.D('.Y-actionSheet-list'), 'slideInUp');
					}
					if (that.hasClass(that.D('.Y-actionSheet-list'), 'slideOutDown')) {
						that.addClass(that.D('.Y-actionSheet'), "Y-display-none-important");
						if (that.isFunction(callback)) {
							callback(_ret);
						}
					}
				});
			},
			alertTip: function(callback, msg, title, buttons) {
				var that = this;
				if ((!that.isFunction(arguments[0])) && (arguments[0])) {
					msg = arguments[0];
				}
				msg = that.isObject(msg) ? (JSON.stringify(msg)) : msg;

				// 设置提示标题为App名称
				title = title ? title : that.appName;
				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							var _tmp = [];
							_tmp.push(buttons[0]);
							buttons = _tmp;
						} else {
							buttons = ["确定"];
						}
					} else {
						var _tmp = [];
						_tmp.push(buttons[0]);
						buttons = _tmp;
					}
				} else {
					buttons = ["确定"];
				}

				// 生成HTML
				that.dialogCore("text", title, msg, buttons);

				that.removeClass(that.D('.Y-dialog-area'), "Y-display-none-important");
				that.on(that.Ds('.Y-dialog-button'), "touchend", function(e) {
					var index = that.getIndex(that.getParents(event.target, "Y-dialog-button"));
					that.addClass(that.D('.Y-dialog'), 'zoomOut');
				});

				that.animationEventEnd(that.D('.Y-dialog'), function(event) {
					if (that.hasClass(that.D('.Y-dialog-area'), "Y-display-none-important") == false) {
						that.removeClass(that.D('.Y-dialog'), 'zoomIn');
					}
					if (that.hasClass(that.D('.Y-dialog'), 'zoomOut')) {
						that.addClass(that.D('.Y-dialog-area'), "Y-display-none-important");
						if (that.isFunction(callback)) {
							callback();
						}
					}
				});
			},
			confirmTip: function(callback, title, msg, buttons) {
				var that = this;

				msg = that.isObject(msg) ? (JSON.stringify(msg)) : msg;
				title = title ? title : "你确定要执行此操作吗？";
				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							buttons = ["取消"].pop(buttons);
						} else {
							buttons = ["确定", "取消"];
						}
					} else {
						var _buttons = [];
						if (buttons.length == 0) {
							_buttons = ["确定", "取消"];
						} else if (buttons.length == 1) {
							_buttons.push(buttons[0]);
							_buttons.push("取消");
						} else if (buttons.length == 2) {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
						} else {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
							_buttons.push(buttons[2]);
						}
						buttons = _buttons;
					}
				} else {
					buttons = ["确定", "取消"];
				}

				var _ret = {};
				var _err = {};
				// 生成HTML
				that.dialogCore("text", title, msg, buttons.reverse());
				var index = buttons.length - 1;
				that.removeClass(that.D('.Y-dialog-area'), "Y-display-none-important");
				that.on(that.Ds('.Y-dialog-button'), "touchend", function(e) {
					index = that.getIndex(that.getParents(event.target, "Y-dialog-button"));
					_ret.buttonIndex = buttons.length - index;
					that.addClass(that.D('.Y-dialog'), 'zoomOut');
				});

				that.animationEventEnd(that.D('.Y-dialog'), function(event) {
					if (that.hasClass(that.D('.Y-dialog-area'), "Y-display-none-important") == false) {
						that.removeClass(that.D('.Y-dialog'), 'zoomIn');
					}
					if (that.hasClass(that.D('.Y-dialog'), 'zoomOut')) {
						that.addClass(that.D('.Y-dialog-area'), "Y-display-none-important");
						if (that.isFunction(callback)) {
							callback(_ret, _err);
						}
					}
				});
			},
			promptTip: function(callback, title, msg, text, type, buttons) {
				var that = this;

				msg = msg ? msg : "请输入值...";
				title = title ? title : "请输入数据后再操作";
				type = type ? type : "text";
				text = text ? text : "";

				if (buttons) {
					if (!that.isArray(buttons)) {
						if (that.isString(buttons)) {
							buttons = ["取消"].pop(buttons);
						} else {
							buttons = ["确定", "取消"];
						}
					} else {
						var _buttons = [];
						if (buttons.length == 0) {
							_buttons = ["确定", "取消"];
						} else if (buttons.length == 1) {
							_buttons.push(buttons[0]);
							_buttons.push("取消");
						} else if (buttons.length == 2) {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
						} else {
							_buttons.push(buttons[0]);
							_buttons.push(buttons[1]);
							_buttons.push(buttons[2]);
						}
						buttons = _buttons;
					}
				} else {
					buttons = ["确定", "取消"];
				}

				var _ret = {};
				var _err = {};
				// 生成HTML

				var _msg = '<div class="Y-dialog-prompt-tip Y-font-size-16">' + msg + '</div><input type="text" class="Y-dialog-prompt-text Y-width-100-percent Y-border-none padding Y-padding-10 Y-box-sizing-border-box Y-box-shadow-inset" style="border:1px solid #f1f1f1;" placeholder="请输入值..." value="' + text + '" />';

				that.dialogCore("text", title, _msg, buttons.reverse());
				var index = buttons.length - 1;
				that.removeClass(that.D('.Y-dialog-area'), "Y-display-none-important");
				that.on(that.Ds('.Y-dialog-button'), "touchend", function(e) {
					index = that.getIndex(that.getParents(event.target, "Y-dialog-button"));
					_ret.buttonIndex = buttons.length - index;
					_ret.text = that.D('.Y-dialog-prompt-text').value;
					that.addClass(that.D('.Y-dialog'), 'zoomOut');
				});

				that.animationEventEnd(that.D('.Y-dialog'), function(event) {
					if (that.hasClass(that.D('.Y-dialog-area'), "Y-display-none-important") == false) {
						that.removeClass(that.D('.Y-dialog'), 'zoomIn');
					}
					if (that.hasClass(that.D('.Y-dialog'), 'zoomOut')) {
						that.addClass(that.D('.Y-dialog-area'), "Y-display-none-important");
						if (that.isFunction(callback)) {
							callback(_ret, _err);
						}
					}
				});
			},
			toastTip: function(callback, msg, duration, location) {
				var that = this;
				var tip = null;

				if ((!that.isFunction(arguments[0])) && (arguments[0])) {
					msg = arguments[0];
				}

				msg = that.isObject(msg) ? (JSON.stringify(msg)) : msg;
				duration = Math.abs(that.isNumber(duration) ? Number(duration) : 2000);

				var locationArr = ["top", "middle", "bottom"];
				location = location ? location : "bottom";
				location = locationArr.indexOf(location) > -1 ? location : "bottom";

				clearTimeout(tip);
				var clientWidth = window.outerWidth;
				var clientYeight = window.outerYeight;
				if (that.Ds(".Y-toast") && that.Ds(".Y-toast").length > 0) {
					document.body.removeChild(that.D(".Y-toast"));
				}
				var html = '<div class="Y-toast Y-position-absolute animated bounceIn Y-background-color-transparent-6 Y-theme-font-color-white Y-font-size-12 Y-padding-horizontal-both-10 Y-padding-vertical-both-5 Y-border-radius-3 Y-display-inline-block Y-word-break-break-all" style="-webkit-animation-duration: 0.3s; animation-duration: 0.3s;z-index: 199305658315;left:50%;max-width:' + (clientWidth - 80) + 'px;">' + msg + '</div>';
				that.prepend(document.body, null, html);
				var offset = that.offset(that.D(".Y-toast"));
				that.D(".Y-toast").style.width = offset.w + "px";
				that.D(".Y-toast").style.marginLeft = -(offset.w / 2) + "px";

				var scrollObj = that.getScroll();

				if (location == "top") {
					that.D(".Y-toast").style.top = scrollObj.t + 30 + "px";
					that.D(".Y-toast").style.bottom = "auto";
				} else if (location == "bottom") {
					that.D(".Y-toast").style.bottom = 30 - scrollObj.t + "px";
					that.D(".Y-toast").style.top = "auto";
				} else if (location == "middle") {
					that.D(".Y-toast").style.top = (clientYeight - offset.h) / 2 + scrollObj.t + "px";
					that.D(".Y-toast").style.bottom = "auto";
				}

				window.onscroll = function() {
					setTimeout(function() {
						var scrollObj = that.getScroll();
						if (that.D(".Y-toast")) {
							if (location == "top") {
								that.D(".Y-toast").style.top = scrollObj.t + 30 + "px";
								that.D(".Y-toast").style.bottom = "auto";
							} else if (location == "bottom") {
								that.D(".Y-toast").style.bottom = 30 - scrollObj.t + "px";
								that.D(".Y-toast").style.top = "auto";
							} else if (location == "middle") {
								that.D(".Y-toast").style.top = (clientYeight - offset.h) / 2 + scrollObj.t + "px";
								that.D(".Y-toast").style.bottom = "auto";
							}
						}
					}, 10);
				};

				tip = setTimeout(function() {
					if (that.isElement(that.D(".Y-toast"))) {
						document.body.removeChild(that.D(".Y-toast"));
					}
					if (that.isFunction(callback)) {
						callback();
					}
				}, duration);

			},
			toastCore: function(iconHTML, tipText, duration, animateName) {
				var that = this;
				iconHTML = iconHTML ? iconHTML : '<span class="Y-display-block Y-line-height-normal"><i class="Y-iconfont Y-icon-right Y-font-size-42"></i></span>';
				tipText = tipText ? tipText : "提交成功";
				duration = Math.abs(that.isNumber(duration) ? Number(duration) : 2000);
				animateName = animateName ? animateName : "rubberBand";

				if (that.Ds("#Y-toast-tip") && that.Ds("#Y-toast-tip").length > 0) {} else {
					var toastDiv = document.createElement("div");
					toastDiv.id = "Y-toast-tip";
					that.addClass(toastDiv, "Y-position-absolute Y-z-index-1000000 Y-height-100 Y-width-100 Y-border-radius-5 Y-theme-background-color-black Y-theme-font-color-white Y-center-all Y-text-align-center Y-background-color-transparent-5 animated " + animateName);
					that.cssText(toastDiv, "left:50%;top:50%;margin-left:-50px;")
					var html = "";
					html += '<div>';
					html += iconHTML;
					html += '<label class="Y-display-block Y-margin-vertical-top-3 Y-font-size-14 Y-theme-font-color-white">' + tipText + '</label>';
					html += '</div>';
					toastDiv.innerHTML = html;
					that.D("body").appendChild(toastDiv);

					var scrollObj = that.getScroll();
					that.D("#Y-toast-tip").style.marginTop = scrollObj.t - 50 + "px";

					window.onscroll = function(event) {
						setTimeout(function() {
							var scrollObj = that.getScroll();
							if (that.D("#Y-toast-tip")) {
								that.D("#Y-toast-tip").style.marginTop = scrollObj.t - 50 + "px";
							}
						}, 10);
					};

					setTimeout(function() {
						Y.closeToast();
					}, duration);
				}
			},
			toastSuccess: function(duration) {
				var that = this;
				that.toastCore('<span class="Y-display-block Y-line-height-normal"><i class="Y-iconfont Y-icon-right Y-font-size-42"></i></span>', "提交成功", duration);
			},
			toastError: function(duration) {
				var that = this;
				that.toastCore('<span class="Y-display-block Y-line-height-normal"><i class="Y-iconfont Y-icon-error Y-font-size-42"></i></span>', "提交失败", duration);
			},
			toastLoading: function(duration) {
				var that = this;
				duration = Math.abs(that.isNumber(duration) ? Number(duration) : 10000);
				that.toastCore('<span class="Y-display-block Y-line-height-normal Y-animate-rotate"><i class="Y-iconfont Y-icon-loading Y-font-size-42"></i></span>', "加载中...", duration);
			},
			closeToast: function() {
				var that = this;
				if (that.Ds("#Y-toast-tip") && that.Ds("#Y-toast-tip").length > 0) {
					that.D("body").removeChild(that.D("#Y-toast-tip"));
				}
			},
			// 切换显示隐藏（通常用于底部分享，弹窗显示）
			swiperShare: function(parentSelector, animateSelector, closeElemementClassName, openCallBack, closeCallback) {
				var that = this;

				var parentElem = that.D(parentSelector);
				var animateElem = that.D(parentSelector + " " + animateSelector);

				if (parentElem.classList.contains("Y-display-none-important") == false) {
					that.addClass(animateElem, "Y-animate-scale-small");
				} else {
					that.addClass(animateElem, "Y-animate-scale-big");
					that.removeClass(parentElem, "Y-display-none-important");
				}

				that.animationEventEnd(animateElem, function(e) {
					if (animateElem.classList.contains("Y-animate-scale-big")) {
						that.removeClass(animateElem, "Y-animate-scale-big");

						if (that.isFunction(openCallBack)) {
							openCallBack();
						}
					}
					if (animateElem.classList.contains("Y-animate-scale-small")) {
						that.removeClass(animateElem, "Y-animate-scale-small");
						that.addClass(parentElem, "Y-display-none-important");
						if (that.isFunction(closeCallback)) {
							closeCallback();
						}
					}
				});

				that.one(window, 'touchend', function(e) {
					var src = event.target;
					if (src.tagName.toLowerCase() == "div" && src.classList.contains(closeElemementClassName)) {
						if (parentElem.classList.contains("Y-display-none-important") == false) {
							that.swiperShare(parentSelector, animateSelector, closeElemementClassName);
						}
					}
				}, true);

			},

			// ######################### 模板引擎
			tppl: function(tpl, data) {
				var that = this;

				var fn = function(d) {
					var i, k = [],
						v = [];
					for (i in d) {
						k.push(i);
						v.push(d[i]);
					};
					return (new Function(k, fn.$)).apply(d, v);
				};
				if (!fn.$) {
					var tpls = tpl.split(that.tppl_flag[0]);
					fn.$ = "var $=''";
					for (var t = 0; t < tpls.length; t++) {
						var p = tpls[t].split(that.tppl_flag[1]);
						if (t != 0) {
							fn.$ += '=' == p[0].charAt(0) ? "+(" + p[0].substr(1) + ")" : ";" + p[0].replace(/\r\n/g, '') + "$=$"
						}
						// 支持 <pre> 和 [::] 包裹的 js 代码
						fn.$ += "+'" + p[p.length - 1].replace(/\'/g, "\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n') + "'";
					}
					fn.$ += ";return $;";
					// log(fn.$);
				}
				return data ? fn(data) : fn;
			}
		});
	}
}(function(YExports) {
	var Y = typeof YExports !== 'undefined' ? YExports : {};
	// ######################### 属性
	Object.defineProperty(Y, "appId", {
		get: function() {

			return api.appId;

		}
	});
	Object.defineProperty(Y, "appName", {
		get: function() {

			return api.appName;

		}
	});
	Object.defineProperty(Y, "appVersion", {
		get: function() {

			return api.appVersion;

		}
	});
	Object.defineProperty(Y, "systemType", {
		get: function() {

			return api.systemType;

		}
	});
	Object.defineProperty(Y, "systemVersion", {
		get: function() {

			return api.systemVersion;

		}
	});
	Object.defineProperty(Y, "version", {
		get: function() {

			return api.version;

		}
	});
	Object.defineProperty(Y, "deviceId", {
		get: function() {

			return api.deviceId;

		}
	});
	Object.defineProperty(Y, "deviceToken", {
		get: function() {

			return api.deviceToken;

		}
	});
	Object.defineProperty(Y, "deviceModel", {
		get: function() {

			return api.deviceModel;

		}
	});
	Object.defineProperty(Y, "deviceName", {
		get: function() {

			return api.deviceName;

		}
	});
	Object.defineProperty(Y, "operator", {
		get: function() {

			return api.operator;

		}
	});
	Object.defineProperty(Y, "connectionType", {
		get: function() {

			return api.connectionType;

		}
	});
	Object.defineProperty(Y, "fullScreen", {
		get: function() {

			return api.fullScreen;

		}
	});
	Object.defineProperty(Y, "screenWidth", {
		get: function() {

			return api.screenWidth;

		}
	});
	Object.defineProperty(Y, "screenHeight", {
		get: function() {

			return api.screenHeight;

		}
	});
	Object.defineProperty(Y, "winName", {
		get: function() {

			return api.winName;

		}
	});
	Object.defineProperty(Y, "winWidth", {
		get: function() {

			return api.winWidth;

		}
	});
	Object.defineProperty(Y, "winHeight", {
		get: function() {

			return api.winHeight;

		}
	});
	Object.defineProperty(Y, "frameName", {
		get: function() {

			return api.frameName;

		}
	});
	Object.defineProperty(Y, "frameWidth", {
		get: function() {

			return api.frameWidth;

		}
	});
	Object.defineProperty(Y, "frameHeight", {
		get: function() {

			return api.frameHeight;

		}
	});
	Object.defineProperty(Y, "pageParam", {
		get: function() {

			return api.pageParam;

		}
	});
	Object.defineProperty(Y, "wgtParam", {
		get: function() {

			return api.wgtParam;

		}
	});
	Object.defineProperty(Y, "appParam", {
		get: function() {

			return api.appParam;

		}
	});
	Object.defineProperty(Y, "wgtRootDir", {
		get: function() {

			return api.wgtRootDir;

		}
	});
	Object.defineProperty(Y, "fsDir", {
		get: function() {

			return api.fsDir;

		}
	});
	Object.defineProperty(Y, "cacheDir", {
		get: function() {

			return api.cacheDir;

		}
	});
	Object.defineProperty(Y, "iOS7StatusBarAppearance", {
		get: function() {

			return api.iOS7StatusBarAppearance;

		}
	});
	// ######################### 设置pageParam默认值
	var _openWin_ = Y.DEFAULT_CONFIG.openWin_CONFIG;
	Object.defineProperty(_openWin_, "pageParam", {
		get: function() {

			return Y.pageParam;

		}
	});
	Object.defineProperty(_openWin_, "delay", {
		get: function() {

			return Y.systemType == "ios" ? 0 : 0;

		}
	});
	Object.defineProperty(_openWin_, "useWKWebView", {
		get: function() {

			return (Y.systemType == "ios" && parseFloat(Y.systemVersion) >= 8.0) ? true : false;

		}
	});
	var _openFrame_ = Y.DEFAULT_CONFIG.openFrame_CONFIG;
	Object.defineProperty(_openFrame_, "pageParam", {
		get: function() {

			return Y.pageParam;

		}
	});
	Object.defineProperty(_openFrame_, "useWKWebView", {
		get: function() {

			return (Y.systemType == "ios" && parseFloat(Y.systemVersion) >= 8.0) ? true : false;

		}
	});
	var _openPopoverWin_ = Y.DEFAULT_CONFIG.openPopoverWin_CONFIG;
	Object.defineProperty(_openPopoverWin_, "pageParam", {
		get: function() {

			return Y.pageParam;

		}
	});
	var _openDrawerLayout_ = Y.DEFAULT_CONFIG.openDrawerLayout_CONFIG;
	Object.defineProperty(_openDrawerLayout_, "pageParam", {
		get: function() {
			
			return Y.pageParam;
			
		}
	});
	// ######################### 常量
	// toast位置
	Object.defineProperty(Y, "ENUM_toast_location", {
		get: function() {

			return {
				top: "top",
				middle: "middle",
				bottom: "bottom"
			};

		}
	});

	// 传感器类型
	Object.defineProperty(Y, "ENUM_startSensor_type", {
		get: function() {

			return {
				accelerometer: "accelerometer",
				gyroscope: "gyroscope",
				magnetic_field: "magnetic_field",
				proximity: "proximity"
			};

		}
	});
});