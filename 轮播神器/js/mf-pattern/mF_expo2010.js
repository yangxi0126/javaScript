myFocus.pattern.extend({//*********************2010世博****************** 这个也没什么好说的
	'mF_expo2010':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
		$focus.addHtml('<div class="txt_bg"></div>');
		//CSS
		var txtH=settings.txtHeight;
		$picList.each(function(i){
			this.style.display='none';
			$txtList[i].style.bottom=-txtH+'px';
		});
		//PLAY
		$focus.play(function(prev){
			$picList.eq(prev).fadeOut();
			$numList[prev].className='';
		},function(next,n,prev){
			$picList.eq(next).fadeIn();
			$txtList.eq(prev).slide({bottom:-txtH},200,'swing',function(){
				$txtList.eq(next).slide({bottom:0},200);
			});
			$numList[next].className='current';
		});
		//Control
		settings.delay=200;//固定其延迟
		$focus.bindControl($numList);
	}
});
myFocus.config.extend({'mF_expo2010':{txtHeight:36}});//默认文字层高度