myFocus.pattern.extend({//*********************雷柏风格  一般轮播******************
	'mF_rapoo':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtBox=$focus.addListTxt();
		var $txtList=$txtBox.find('li');
		var $numBox=$focus.addListNum();
		var $numList=$numBox.find('li');
		var $prevBtn=$focus.addHtml('<div class="prev"><a href="javascript:;">&#8249;</a></div>');
		var $nextBtn=$focus.addHtml('<div class="next"><a href="javascript:;">&#8250;</a></div>');
		//CSS
		var txtW=settings.txtWidth,n=$picList.length;
		$txtBox[0].style.width=(n-1)*24+txtW+'px';
		$numBox[0].style.width=n*24+6+txtW+'px';
		$prevBtn[0].style.right=parseInt($numBox[0].style.width)+26+'px';
		for(var i=0;i<n;i++){
			$txtList[i].style.left=i*24+'px';
			$picList[i].style.left=settings.width+'px';
		}
		//PLAY
		$focus.play(function(i){
			$txtList[i].style.width=0+'px';
			$numList[i].className='';
			$numList.each(function(){this.style.marginLeft=6+'px'});
			$nextBtn[0].style.right=88+'px';
		},function(next,n,prev){
			$picList[next].style.zIndex=1;
			$picList.eq(next).slide({left:0},400,'easeInOut',function(){
				this.style.zIndex='';
				if(prev!==next) $picList[prev].style.left=settings.width+'px';
			});
			$txtList.eq(next).slide({width:txtW},400,'easeInOut');
			$nextBtn.slide({right:14},400,'easeInOut');
			$numList[next].className='current';
			if(next<n-1) $numList.eq(next+1).slide({marginLeft:txtW+12},400,'easeInOut');
		});
		//Control
		settings.trigger='click';//固定trigger类型为‘click’
		$focus.bindControl($numList);
		//Prev & Next
		$prevBtn.bind('click',function(){$focus.run('-=1')});
		$nextBtn.bind('click',function(){$focus.run('+=1')});
	}
});
myFocus.config.extend({
	'mF_rapoo':{//可选个性参数
		txtWidth:68,//文字段宽度(像素)
		txtHeight:18//文字段高度(像素)
	}
});