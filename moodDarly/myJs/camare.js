function plusReady() {
	// 弹出系统选择按钮框  
	mui("body").on("tap", ".imageup", function() {
		page.imgUp();
	})

}

var page = null;
page = {
	imgUp: function() {
			var m = this;
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: [{
					title: "拍照"
				}, {
					title: "从相册中选择"
				}]
			}, function(e) { //1 是拍照  2 从相册中选择  
				switch(e.index) {
					case 1:
						clickCamera();
						break;
					case 2:
						clickGallery();
						break;
				}
			});
		}
		//摄像头  
}

//发送照片  

function clickGallery() {
	plus.gallery.pick(function(path) {
		plus.zip.compressImage({
			src: path,
			dst: "_doc/chat/gallery/" + path,
			quality: 20,
			overwrite: true
		}, function(e) {
			var task = plus.uploader.createUpload(server + "upload/chat", {
				method: "post"
			}, function(t, sta) {
				console.log(JSON.stringify(t))
				if(sta == 200) {
					var msg = t.responseText;
					var oImg = JSON.parse(msg);
					var imgUrl = oImg.urls;
					var re = new RegExp("\\\\", "g");
					imgUrl = imgUrl.replace(re, "/");
					uploadMsg(2, imgUrl);
				}
			});
			task.addFile(e.target, {});
			task.start();
		}, function(err) {
			console.error("压缩失败：" + err.message);
		});

	}, function(err) {});
};

// 拍照  

function clickCamera() {
	var cmr = plus.camera.getCamera();
	var res = cmr.supportedImageResolutions[0];
	var fmt = cmr.supportedImageFormats[0];
	cmr.captureImage(function(path) {
		//plus.io.resolveLocalFileSystemURL(path, function(entry) {  
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			var localUrl = entry.toLocalURL();
			plus.zip.compressImage({
				src: localUrl,
				dst: "_doc/chat/camera/" + localUrl,
				quality: 20,
				overwrite: true
			}, function(e) {
				var task = plus.uploader.createUpload(server + "upload/chat", {
					method: "post"
				}, function(t, sta) {
					if(sta == 200) {
						var msg = t.responseText;
						var oImg = JSON.parse(msg);
						var imgUrl = oImg.urls;
						var re = new RegExp("\\\\", "g");
						imgUrl = imgUrl.replace(re, "/");
						console.log(imgUrl);
						uploadMsg(2, imgUrl);
					}
				});
				task.addFile(e.target, {});
				task.start();
			}, function(err) {
				console.log("压缩失败：  " + err.message);
			});
		});
	}, function(err) {
		console.error("拍照失败：" + err.message);
	}, {
		index: 1
	});
};

if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}