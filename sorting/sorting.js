let hidebox = document.getElementsByClassName("hidebox")[0],
	hide = document.getElementsByClassName("hide")[0],
	jg = document.getElementsByClassName("jg")[0],
	pricePara = document.getElementsByClassName("pp"),
	image = document.getElementsByTagName("img"),
	intro = document.getElementsByClassName("intro"),
	money = document.getElementsByClassName("money"),
	thing = document.getElementsByClassName("thing")[0],
	length = image.length,
	arr = [];
for(let i=0;i<length;i++){
	arr[i] = {
		src : image[i].src,
		title : intro[i].innerHTML,
		price : money[i].innerHTML,
		num : money[i].innerHTML.substring(0)-0
	};
}
hidebox.onmouseenter = function(){
	hide.style.display = 'block';
	pricePara[0].onclick = function(){
		jg.innerHTML = this.innerHTML;
		hide.style.display = "none";
		sort(0);
	}
	pricePara[1].onclick = function(){
		jg.innerHTML = this.innerHTML;
		hide.style.display = "none";
		sort(1);
	}
}
hidebox.onmouseleave = function(){
	hide.style.display = "none";
}
function sort(x){
	arr.sort(
		x?function(a,b){return a.num-b.num}:
		  function(a,b){return b.num-a.num}
	);
	let str = "";
	thing.innerHTML = "";
	for(let i=0;i<length;i++){
		str += `<div class="goods">
					<img src ="${arr[i].src}">
					<p class="intro">${arr[i].title}</p>
					<div class="price">￥<span class="money">${arr[i].price}</span></div>
				</div>`;
	}
	thing.innerHTML = str;
}

