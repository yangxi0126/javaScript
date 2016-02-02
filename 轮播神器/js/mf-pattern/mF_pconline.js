myFocus.pattern.extend({//*********************太平洋电脑网风格 这个太普通，还没有左右选项******************
	'mF_pconline':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
		//CSS
		var txtH=settings.txtHeight;
		$focus[0].style.height=settings.height+txtH+'px';
		//PLAY
		$focus.play(function(i){
			$picList[i].style.display='none';
			$txtList[i].style.display='none';
			$numList[i].className='';
		},function(i){
			$picList.eq(i).fadeIn(settings.duration);
			$txtList[i].style.display='block';
			$numList[i].className='current';
		});
		//Control
		$focus.bindControl($numList);
	}
});
myFocus.config.extend({
	'mF_pconline':{
		duration:200,//图片淡出时间
		txtHeight:28//标题高度
	}
});