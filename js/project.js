var h = window.innerHeight;
var w = window.innerWidth;
var debug = false; //调试模式
var openTime = 0;
var startTime;
var flags = {};

//解析XML
function loadXml(str) {
	if(str == null) {
		return null;
	}
	var doc = str;
	try {
		doc = createXMLDOM();
		doc.async = false;
		doc.loadXML(str);
	} catch(e) {
		doc = $.parseXML(str);
	}
	return doc;
}

//模拟点击按钮
function fake_click(obj) {
	var ev = document.createEvent("MouseEvents");
	ev.initMouseEvent(
		"click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
	);
	obj.dispatchEvent(ev);
}

//下载
function download(name, data) {
	var urlObject = window.URL || window.webkitURL || window;

	var downloadData = new Blob([data]);

	var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
	save_link.href = urlObject.createObjectURL(downloadData);
	save_link.download = name;
	fake_click(save_link);
}

//数字长度
function pad(num, n) {
	var len = num.toString().length;
	for(; len < n; len++) {
		num = "0" + num;
	}
	return num;
}

/*计时函数
 * 用法
 * var time=new timer
 * time.stop()
 */
function timer() {
	var t = new Date();
	var time = t.getTime();
	this.stop = function() {
		var t = new Date();
		return t - time;
	};
};
//统计访问时间
var last;

function lastInfo() {
	var tdate = new Date();
	last = cokie.get("runInfo");
	if(last == null) {
		last = {
			"day": tdate.toLocaleString(),
			"time": tdate.getTime(),
			"cont": 1
		};
		cokie.set("runInfo", JSON.stringify(last));
		console.log("初次见面，还请多多指教");
	} else {
		last = JSON.parse(cokie.get("runInfo"));
		console.log("上次访问时间" + last.day);
		console.log("统计访问次数" + last.cont);
		last.day = tdate.toLocaleString();
		last.time = tdate.getTime();
		if(tdate.getTime() - last.time < 60000) last.cont++; //1分钟之内只统计一次访问次数
		cokie.set("runInfo", JSON.stringify(last));
	}

}
//Cookie
var cokie = {
	//写cookies
	set: function(name, value) {
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	},

	//读取cookies

	get: function(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)) return unescape(arr[2]);
		else return null;
	},

	//删除cookies

	del: function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = this.del(name);
		if(cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
};
//图片预加载
function preLoadImg() {
	var img = new Image();
	img.src = "url";
}

//随机数
function RandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	var num = Min + Math.round(Rand * Range);
	return num;
}

function byid(s) {
	return document.getElementById(s);
}

//动态执行 调试用
function ev(msg) {
	try {
		eval(msg);
	} catch(err) {
		alert(err.message);
	}
}

//主动调试输出 
var logflg = {
	s: "",
	i: 2,
	k: true
};

function test(m) {
	var huam = byid("test")
	huam.textContent = m;
}

function strOut(m) {
	var e = byid('logWin');
	e.innerText = m;
}

function logout(m) {
	var e = byid('logWin');
	if(logflg.k) {
		e.innerText = m;
	} else if(m == logflg.s) {
		var m = e.innerText.split("\n");
		var en = logflg.s + " " + logflg.i;
		m[m.length - 2] = en;
		m = m.join("\n");
		e.innerText = m;
		logflg.i++;
	} else {
		e.innerText = e.innerText + m + "\n";
		logflg.s = m;
		logflg.i = 2;
	}
}

//计算间隔天数
function getDateDiff(st, en) {
	var BirthDay = new Date(st);
	var today;
	if(en != undefined) {
		today = new Date(en);
	} else {
		today = new Date();
	};
	var timeold = (today.getTime() - BirthDay.getTime());
	var sectimeold = timeold / 1000;
	var secondsold = Math.floor(sectimeold);
	var msPerDay = 24 * 60 * 60 * 1000;
	var e_daysold = timeold / msPerDay;
	var daysold = Math.floor(e_daysold);
	var e_hrsold = (e_daysold - daysold) * 24;
	var hrsold = Math.floor(e_hrsold);
	var e_minsold = (e_hrsold - hrsold) * 60;
	var minsold = Math.floor((e_hrsold - hrsold) * 60);
	var seconds = Math.floor((e_minsold - minsold) * 60);
	return checkTime(daysold) + "天" + checkTime(hrsold) + "小时" + checkTime(minsold) + "分" + checkTime(seconds) + "秒";
}

//更新存活时间
function show_date_time() {
	var tm = document.getElementsByName('show_time');
	for(var i = 0; i < tm.length; i++) {
		tm[i].innerText = "Sakura & Erii の主页已存活" + getDateDiff(tm[i].title);
	}
	//window.setTimeout("show_date_time()", 1000);
}
var show_date_timer = setInterval(show_date_time, 1000);

function checkTime(i) {
	if(i < 10) {
		i = "0" + i;
	}
	return i;
}

//获取URL数据
function urlData(n) {
	var sc = window.location.search;
	var vr = window.location.search.split('&');
	var v = {};
	if(vr.length > 0) {
		for(i in vr) {
			var str = vr[i].split('=');
			if(str[0] = n) {
				return str[1];
			}
		}
	}
	return null;
}
//加载js
function loadScript(url, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(typeof(callback) != "undefined") {
		if(script.readyState) {
			script.onreadystatechange = function() {
				if(script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {
			script.onload = function() {
				callback();
			};
		}
	}
	script.src = url;
	document.body.appendChild(script);
}
/*获取URL数据
 * url:地址
 * fum:加载完成后运行
 * bool:为true时同步执行 反之异步
 */
function getURL(url, fun, bool) {
	var xmlhttp;
	if(bool == undefined) bool = true;
	if(window.XMLHttpRequest) {
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp = new XMLHttpRequest();
	} else {
		// IE6, IE5 浏览器执行代码
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			//logout(xmlhttp.responseText);
			fun(xmlhttp.responseText);
		} else if(xmlhttp.readyState == 4 && xmlhttp.status != 200){
			fun(null, xmlhttp.status);
		}
	}
	xmlhttp.open("GET", url, bool);
	xmlhttp.send();
}