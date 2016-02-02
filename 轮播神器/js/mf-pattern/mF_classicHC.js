myFocus.pattern.extend({
	'mF_classicHC':function(settings,$){//*********************经典怀旧系列一--慧聪风格******************
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $numBg=$focus.addHtml('<div class="num_bg"></div>');
		var $numBox=$focus.addListNum();
		var $numList=$numBox.find('li');
		//CSS
		var txtH=settings.txtHeight,w=settings.width,h=settings.height;
		$focus.css({width:w+2,height:h+txtH+2});
		$numBg[0].style.bottom=$numBox[0].style.bottom=txtH+1+'px';
		for(var i=0,n=$picList.length;i<n;i++){
			$picList[i].style.display='none';
			$txtList[i].style.cssText='display:none;top:'+(h+2)+'px;width:'+(w+2)+'px';
		}
		//PLAY
		$focus.play(function(i){
			$picList[i].style.display='none';
			$txtList[i].style.display='none';
			$numList[i].className='';
		},function(i){
			$picList.eq(i).fadeIn();
			$txtList[i].style.display='';
			$numList[i].className='current';
		});
		//Control
		$focus.bindControl($numList);
	}
});
myFocus.config.extend({'mF_classicHC':{txtHeight:0}});//默认文字层高度txtHeight:26   这里我目前必须改为0，估计是要根据自己网页的实际结构来设置