myFocus.pattern.extend({//*********************kdui一般轮播，每张图片的标题动态展示不错******************
	'mF_kdui':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $dotList=$focus.addList('dot').find('li');
		var $prevBtn=$focus.addHtml('<div class="prev"></div>');
		var $nextBtn=$focus.addHtml('<div class="next"></div>');
		//PLAY
		var param={isRunning:false};
		$focus.play(null,function(i,n,l){
			param.isRunning=true;
			$txtList.eq(l).slide({left:-settings.width},800,'easeInBack');
			fx(i,l);//延迟执行部分
		});
		function fx(i,l){
			setTimeout(function(){
				$txtList.eq(i).css({display:'block',left:settings.width}).slide({left:0},300);
				$picList.eq(i).css({display:'block',left:settings.width}).slide({left:0},function(){param.isRunning=false});
				if(i!==l) $picList.eq(l).slide({left:-settings.width},700);
				$dotList[l].className='';
				$dotList[i].className='current';
			},600);
		}
		//Control
		$focus.bindControl($dotList,param);
		$prevBtn.bind('click',function(){if(!param.isRunning) $focus.run('-=1')});
		$nextBtn.bind('click',function(){if(!param.isRunning) $focus.run('+=1')});
		$focus.bind('mouseover',function(){$prevBtn.addClass('arr-hover'),$nextBtn.addClass('arr-hover')});
		$focus.bind('mouseout',function(){$prevBtn.removeClass('arr-hover'),$nextBtn.removeClass('arr-hover')});
	}
});
myFocus.extend( myFocus.fn.easing,{//扩展缓动方法
	easeInBack: function (t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	}
});