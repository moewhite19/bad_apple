var badApple = {
	fps: [],  //帧数组
	cont: 0,  //加载块数量
	row: 0,  //当前帧位置
	loadIndex: 0, //
	//	f: [],
	colr: "#FFFFFF", //颜色
	State: 0,  //加载状态 

	isPlay: false,
	tick: false,


	// out: function () {
	// 	var cont = 0
	// 	var arr = []
	// 	for (var i in badApple.fps) {
	// 		if (cont >= 512) {
	// 			badApple.f.push(arr);
	// 			arr = [];
	// 			cont = 0;
	// 		}
	// 		arr.push(badApple.fps[i])
	// 		cont++
	// 	}
	// 	badApple.f.push(arr);
	// 	arr = [];
	// },
	// save: function (i) {
	// 	for (i in badApple.f) {
	// 		download(i + ".json", JSON.stringify(badApple.f[i]))
	// 	}
	// },
	get: function () {
		badApple.loadtick = byid("loadtick")
		getURL("BadAppleDat/" + "BadApple_" + pad(badApple.loadIndex, 4) + ".svg", function (s) {
			if (s == null) { } else {
				var p1 = loadXml(s).children[0].children;
				var ar = []
				for (var i = 0; i < p1.length; i++) {
					var e = p1[i].attributes
					var c = e.fill.nodeValue
					var r = e.d.nodeValue
					if (parseInt(c[1] + c[2], 16) < 86) {
						r = null;
					} else {
						ar.push(r);
						badApple.loadtick.innerText = "获取进度" + badApple.loadIndex;
					}
				}
				if (ar.length == 0) {
					badApple.fps.push(["M"]);
				} else {
					badApple.fps.push(ar);
				}
				badApple.loadIndex++;
				badApple.get();
			}
		})
	},

	loading: function () {
		badApple.loadout = byid("loadtick");
		getURL("dat/" + badApple.cont + ".json", function (download) {
			if (download === null) {
				badApple.loadout.innerText = "加载完成" + badApple.fps.length
				badApple.State = 2;
			} else {
				var obj = JSON.parse(download);
				for (i in obj) {
					badApple.fps.push(obj[i]);
				}
				if (badApple.isPlay && !badApple.tick) {
					badApple.play();
					badApple.tick = true;
					console.log("块加载完成并继续播放")
				}
				badApple.cont++;
				badApple.loadout.innerText = "已加载" + badApple.fps.length
				badApple.loading();
			}
		})
	},
	load: function () {
		if (badApple.State <= 0) {
			badApple.State = 1;
			player.play(1, 0, true)
			badApple.loading()
		}
	},
	play: function () {
		badApple.test = byid("test");
		badApple.playtick = byid("playtick");
		badApple.viev = byid("outSvg");
		if (badApple.isPlay && badApple.tick) {
			badApple.paus();
		} else if (badApple.State < 1) {
			badApple.tick = false;
			badApple.isPlay = true;
			badApple.load();
			console.log("开始缓存并播放")
			badApple.test.innerText = "正在准备播放"
		} else {
			badApple.tick = true;
			badApple.isPlay = true;
			badApple.row--;
			player.play();
			badApple.playing();
			console.log("继续播放")
		}
	},
	paus: function () {
		badApple.tick = false;
		badApple.isPlay = false;
		player.pause();
		console.log("暂停");
	},
	stop: function () {
		badApple.tick = false;
		badApple.isPlay = false;
		badApple.row = 0;
		player.play(1, 0, true);
	},
	playing: function () {
		if (badApple.tick) {
			var i = Math.round(player.audio.prop('currentTime') / 0.0333);
			if (i === badApple.row) {
				setTimeout(badApple.playing, 3);
				return;
			}

			//解决漏帧的问题
			var jump = i - badApple.row;
			if (jump === 2) {
				// if (jump > 2) {
				// 	console.log("已跳过帧数" + jump);
				// }
				badApple.row--;
			}

			badApple.row = i;

			var arr = [];
			var gen = badApple.fps[i];
			if (gen == undefined) {
				if (badApple.State == 2) {
					console.log("播放完成");
					badApple.test.innerText = "播放完成";
					badApple.stop();
					return;
				} else {
					badApple.tick = false;
					console.log("正在缓冲");
					player.pause();
					badApple.test.innerText = "正在加载画面...";
					return;
				}
			} else {
				badApple.playtick.innerText = "播放进度:" + badApple.row;
				badApple.test.innerText = "画面层数:" + gen.length;
				for (tmp in gen) {
					arr.push('<path fill=' + badApple.colr + ' opacity=\"1.00\" d=\"' + gen[tmp] + '\"></path>');
				}
				badApple.viev.innerHTML = arr.join("\n");
				arr = [];
			}
			setTimeout(badApple.playing, 6);
		}
	}
};

//绑定按键事件
document.onkeydown = function (event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if (e.keyCode == 32) {
		badApple.play();
	}
}