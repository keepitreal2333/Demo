var ball = document.getElementById("box").getElementsByTagName("p"),
	length = ball.length;
	for(var i=0;i<length;i++){
		var oBall = ball[i];
		changeColor(oBall);
		oBall.x = Math.random()*5+1;
		oBall.y = Math.random()*5+1;
	}
	var browserHeight,browserWidth;
	getbrowser();
	window.onresize = getbrowser;
	// 获取浏览器的边界
	function getbrowser(){
		browserWidth = window.innerWidth - 50;
		browserHeight = window.innerHeight - 50;
	}
	// 运动
	(function move(){
		for(var i=0;i<length;i++){
			var oBall = ball[i];
			var left = oBall.offsetLeft + oBall.x;
			var top = oBall.offsetTop + oBall.y;
			if(left<=0||left>=browserWidth){
				oBall.x = -oBall.x;
				left = Math.max(left,0);
				left = Math.min(left,browserWidth);
				changeColor(oBall);
			}
			if(top<=0||top>=browserHeight){
				oBall.y = -oBall.y;
				top = Math.max(top,0);
				top = Math.min(top,browserHeight);
				changeColor(oBall);
			}
			oBall.style.left = left + "px";
			oBall.style.top = top + "px";
		}
		requestAnimationFrame(move);
	})();
	// 碰撞后改变颜色
	function changeColor(oBall){
		var r = Math.floor(Math.random()*256);
		var g = Math.floor(Math.random()*256);
		var b = Math.floor(Math.random()*256);
		var rgb = "rgb("+r+","+g+","+b+")";
		oBall.style.background = "radial-gradient(circle,#fff,"+rgb+")";
	}
