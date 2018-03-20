var cirLi = document.getElementsByClassName("cir")[0].children,
	pic = document.querySelector("#index .photo ul"),
	butt = document.getElementsByClassName("button")[0].children,
	main = document.getElementById("index"),
	length = cirLi.length,
	index = 0,
	oWidth = 500;
for(var i=0;i<length;i++){
	(function(i){
		cirLi[i].onclick = function(){
			change(i);
		};
	})(i);
}
butt[0].onclick = function(){
	change(index-1);
};
butt[1].onclick = function(){
	change(index+1);
};
var timer;
main.onmouseenter = function(){
	clearInterval(timer);
};
main.onmouseleave = auto();
function auto(){
	timer = setInterval(function(){
		change(index+1);
	},1000);
	return auto;
}
function change(i){
	cirLi[index].classList.remove("on");
	index = i;
	if(index>=length){
		index = 0;
		fn(index);
	}
	if(index<0){
		index = length - 1;
		fn(index);
	}
	cirLi[index].classList.add("on");
	pic.style.left = -i*oWidth + "px";
	function fn(x){
		setTimeout(function(){
			pic.classList.remove("transition");
			pic.style.left = "-"+x+"00%";
			setTimeout(function(){
				pic.classList.add("transition");
			},10);
		},300);		
	}
}

