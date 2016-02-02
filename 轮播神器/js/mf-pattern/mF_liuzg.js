/*
* 绚丽切片风格 v2.0
* Date 2012.5.25
* Author koen_lee  这个也不错，不过也没有左右选项
*/
myFocus.pattern.extend({
	'mF_liuzg':function(settings,$){
		var $focus=$(settings);
		var $picBox=$focus.find('.pic');
		var $picList=$picBox.find('li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
		//HTML++
		var c=Math.floor(settings.height/settings.chipHeight),n=$txtList.length,html=['<ul>'];
		for(var i=0;i<c;i++){
			html.push('<li><div>');
			for(var j=0;j<n;j++) html.push($picList[j].innerHTML);
			html.push('</div></li>');
		}
		html.push('</ul>');
		$picBox[0].innerHTML=html.join('');
		//CSS
		var w=settings.width,h=settings.height,cH=Math.round(h/c);
		$picList=$picBox.find('li');
        var $picDivList=$picBox.find('div');
		$picList.each(function(i){
			$picList.eq(i).css({width:w,height:cH});
			$picDivList.eq(i).css({height:h*n,top:-i*h});
		});
		$picBox.find('a').each(function(){this.style.height=h+'px'});
		//PLAY
		$focus.play(function(i){
			$txtList[i].style.display='none';
			$numList[i].className='';
		},function(i){
			var tt=settings.type||Math.round(1+Math.random()*2);//效果选择
			var dur=tt===1?1200:300;
			for(var j=0;j<c;j++){
				$picDivList.eq(j).slide({top:-i*h-j*cH},tt===3?Math.round(300+(Math.random()*(1200-300))):dur);
				dur=tt===1?dur-150:dur+150;
			}
			$txtList[i].style.display='block';
			$numList[i].className = 'current';
		});
		//Control
		$focus.bindControl($numList);
	}
});
myFocus.config.extend({
	'mF_liuzg':{//可选个性参数
		chipHeight:36,//图片切片高度(像素)，越大切片密度越小
		type:1////切片效果，可选：1(甩头) | 2(甩尾) | 3(凌乱) | 0(随机)
	}
});