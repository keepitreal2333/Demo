	window.requestAnimationFrame = window.requestAnimationFrame||function(fn){return setTimeout(fn,1000/60)};
	window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
	var choose = document.getElementById("choose"),
		map = document.getElementById("map"),
		mscore = document.getElementById("score"),
		rstart = document.getElementById("restart");
		box = document.getElementById("box"),
		biuAll = document.getElementById("BiuAll"),
		reAll = rstart.children,
		abiu = biuAll.children,
		boxOffsetTop = box.offsetTop,
		boxOffsetLeft = box.offsetLeft;
	exe();
	// 开始执行
	function exe(){
		var lever = choose.getElementsByTagName("li");
		for(var i=0;i<lever.length;i++){
			(function(i){
				lever[i].onclick = function(ev){
					ev = ev||window.event;
					var pos = {x : ev.clientX-boxOffsetLeft, 
							   y : ev.clientY-boxOffsetTop};
							   // 获取鼠标当前的坐标，减去box的offset是因为飞机是以box为定位的，而不是以body。
					choose.style.display = "none";
					mscore.style.display = "block";
					box.score = 0;
					mapBack(i);
					var pb = planeBlock(i,pos);
					// 将生成飞机函数中的存储飞机的元素return出来并赋值给pb，以便用于传给另外的函数
					enemy(i,pb);
				}
			})(i);	
		}
		reAll[2].onclick = function(ev){
			// 当点击重新开始时
			choose.style.display = "block";
			rstart.style.display = "none";
			mscore.innerHTML = 0;
			// 当一局结束后重新写入biuAll
			map.innerHTML = "<div id='BiuAll'></div>";
			biuAll = document.getElementById("BiuAll");
			abiu = biuAll.children;
		}
	}
	function mapBack(i){
		// 地图不同关卡更换并移动
		map.style.backgroundImage = "url('images/bg_"+(i+1)+".jpg')";
		(function move(){
			map.bgPosY = map.bgPosY||0;
			map.bgPosY++;
			map.style.backgroundPositionY = map.bgPosY + "px";
			map.bgTimer = requestAnimationFrame(move);
		})();
	}
	function planeBlock(i,pos){
		var img = new Image();
		img.src = "images/plane_1.png";
		img.width = 70;
		img.height = 60;
		img.className = "plane";
		img.style.left = pos.x-img.width/2+"px";
		// 飞机的中心位置
		img.style.top = pos.y+img.height/2+"px";
		map.appendChild(img);
		var leftMin = -img.width/2,
			leftMax = map.clientWidth - img.width/2,
			topMin = 0,
			topMax = map.clientHeight - img.height/2;
		// 上下左右边界值
		document.onmousemove = function(ev){
			ev=ev||window.event;
			var left = ev.clientX - boxOffsetLeft -img.width/2;
			var top = ev.clientY - boxOffsetTop + img.height/2;
			// 同理，获取飞机当前位置
			left = Math.max(leftMin,left);
			left = Math.min(leftMax,left);
			top = Math.max(topMin,top);
			top = Math.min(topMax,top);
			// 规定飞机边界
			img.style.left = left + "px";
			img.style.top = top + "px";
		};
		oBulletShot(img,i);
		return img;
	}
	// 生成子弹
	function oBulletShot(img,i){
		var time = [150,250,400,50][i];
		// 规定各种难度发射子弹的时间间隔
		box.biuInterval = setInterval(function(){
			if(box.score>=250){
				createBiu(true,-1);
				createBiu(true,1);
			}else{
				createBiu();
			}
			
		},time);
		function createBiu(boo,d){
			var biu = new Image();
			biu.src = "images/fire.png";
			biu.width = 30;
			biu.height = 30;
			biu.className = "biu";
			var left = img.offsetLeft+img.width/2-biu.width/2;
			// 设置子弹的位置，以飞机位置为准
			var top = img.offsetTop-img.height/2+biu.height/2;
			
			if(boo){
				left += biu.width*d;
			}

			biu.style.left = left+"px";
			biu.style.top = top+"px";

			biuAll.appendChild(biu);
			// 子弹的多个发射
			function move(){
				if(biu.parentNode){
					var top = biu.offsetTop - 20;
					// 发射出的子弹每个top值累减20
					if(top<-biu.height){
						biuAll.removeChild(biu);
						// top值到了顶点则删去此子弹
					}else{
						biu.style.top = top + "px";
						requestAnimationFrame(move);
					}
				}
			}
			setTimeout(function(){
				requestAnimationFrame(move);
			},20);
		}
	};
	function enemy(i,pb){
		var mapW = map.clientWidth;
		var mapH = map.clientHeight;
		var speed = [3,5,7,10][i];
		var enemyNum = [400,250,150,50][i];
		var num = 1;
		box.eneInterval = setInterval(function(){
			var eneType = num%40?0:1;
			var ene = new Image();
			ene.HP = [1,20][eneType];
			ene.eneType = eneType;
			ene.speed = speed+(Math.random()*0.6-0.3)*speed;
			ene.speed *= eneType?0.5:1;
			ene.src = ["images/enemy_small.png","images/enemy_big.png"][eneType];
			ene.className = "enemy";
			ene.width = [54,104][eneType];
			ene.height = [40,80][eneType];
			ene.style.left = Math.random()*mapW-ene.width/2+"px";
			// 敌机的left位置随机生成，最大不超过整体map的left-敌机宽度的一半
			ene.style.top = -ene.height/2+"px";
			map.appendChild(ene);
			num++;
			function move(){
				// 降落的动画
				if(ene.parentNode){
					var top = ene.offsetTop;
					top+=ene.speed;
					// 敌机每次top增加speed个
					if(top>=mapH){
						box.score --;
						mscore.innerHTML = box.score;
						map.removeChild(ene);
					}else{
						ene.style.top = top+"px";
						for(var i=abiu.length-1;i>=0;i--){
							var ab = abiu[i];
							if(coll(ene,ab)){
								// 如果敌机与子弹碰撞
								biuAll.removeChild(ab);
								// 碰撞的此子弹也移除
								ene.HP--;
								if(!ene.HP){
									box.score += ene.eneType?100:2;
									mscore.innerHTML = box.score;
									boomImg(ene.offsetLeft,ene.offsetTop,ene.width,ene.height,[0,2][eneType]);
									// 执行此函数，给出的是敌机爆出烟雾的图片
									map.removeChild(ene);
									// 此敌机移除
									return;
									// return结束高度下落
								}
							}
						}
						if(pb.parentNode && coll(ene,pb)){
							// 如果敌机与飞机碰撞，前提是飞机还存在
							boomImg(ene.offsetLeft,ene.offsetTop,ene.width,ene.height,[0,2][eneType]);
							// 执行此函数，给出敌机爆出烟雾图片
							boomImg(pb.offsetLeft,pb.offsetTop,pb.width,pb.height,1);
							// 再次执行，给出飞机死亡效果
							map.removeChild(ene);
							map.removeChild(pb);
							gameOver();
							return;
						}
						requestAnimationFrame(move);
					}
				}	
			};
			requestAnimationFrame(move);
		},enemyNum);
	}
	function boomImg(l,t,w,h,n){
		// 敌机或飞机死亡图片
		var boom = new Image();
		boom.src = ["images/boom_small.png","images/plane_1.png","images/boom_big.png"][n];
		boom.width = w;
		boom.height = h;
		boom.className = ["boom","boom1","boom"][n];
		boom.style.left = l + "px";
		boom.style.top = t + "px";
		map.appendChild(boom);
		setTimeout(function(){
			boom.parentNode && map.removeChild(boom);
		},1000);
	}
	function coll(obj1,obj2){
		var t1 = obj1.offsetTop,
			b1 = t1+obj1.clientHeight,
			l1 = obj1.offsetLeft,
			r1 = l1+obj1.clientWidth;
		var t2 = obj2.offsetTop,
			b2 = t2+obj2.clientHeight,
			l2 = obj2.offsetLeft,
			r2 = l2+obj2.clientWidth;
		return!(b1<t2||r1<l2||t1>b2||l1>r2);
		// 当飞机（或子弹）与敌机相碰撞时，返回true
	}
	function gameOver(){
		document.onmousemove = null;
		clearInterval(box.biuInterval);
		clearInterval(box.eneInterval);
		cancelAnimationFrame(map.bgTimer);
		// 全部停止
		restart();		
	}
	function restart(){
		var s = box.score;
		var honor;
		if(s<-100){
			honor = "闪避+MAX";
		}else if(s<10){
			honor = "。。。。";
		}else if(s<100){
			honor = "初级入门";
		}else if(s<200){
			honor = "渐入佳境";
		}else if(s<500){
			honor = "中级入门";
		}else if(s<1000){
			honor = "高级大师";
		}else if(s<2000){
			honor = "终极大师";
		}else if(s>2000){
			honor = "孤独求败";
		}
		rstart.style.display = "block";
		reAll[0].children[0].innerHTML = s;
		reAll[1].children[0].innerHTML = honor;
	}
