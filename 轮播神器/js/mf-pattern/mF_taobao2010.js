myFocus.pattern.extend({//*********************淘宝2010主页风格  一般轮播，无左右，不是无缝******************
	'mF_taobao2010':function(settings,$){
		var $focus=$(settings);
		var $picUl=$focus.find('.pic ul');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
		$picUl[0].innerHTML+=$picUl[0].innerHTML;//无缝复制
		//CSS
		var n=$txtList.length,dir=settings.direction,prop=dir==='left'?'width':'height',dis=settings[prop];
		$picUl.addClass(dir)[0].style[prop]=dis*n*2+'px';
		$picUl.find('li').each(function(){//消除上下li间的多余间隙
			$(this).css({width:settings.width,height:settings.height});
		});
		//PLAY
		var param={};
		$focus.play(function(i){
			var index=i>=n?(i-n):i;
			$numList[index].className = '';
			$txtList[index].style.display = 'none';
		},function(i){
			var index=i>=n?(i-n):i;
			param[dir]=-dis*i;
			$picUl.slide(param,settings.duration,settings.easing);
			$numList[index].className = 'current';
			$txtList[index].style.display = 'block';
		},settings.seamless);
		//Control
		$focus.bindControl($numList);
	}
});
myFocus.config.extend({
	'mF_taobao2010':{//可选个性参数
		seamless:true,//是否无缝，可选：true(是)/false(否)
		duration:600,//过渡时间(毫秒)，时间越大速度越小
		direction:'left',//运动方向，可选：'top'(向上) | 'left'(向左)
		easing:'easeOut'//运动形式，可选：'easeOut'(快出慢入) | 'easeIn'(慢出快入) | 'easeInOut'(慢出慢入) | 'swing'(摇摆运动) | 'linear'(匀速运动)
	}
});