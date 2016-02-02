myFocus.pattern.extend({//*********************趣玩风格 一般轮播，没有左右******************
	'mF_quwan':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
		//CSS
		var numH=$numList.css('height');
		$txtList.each(function(){
			$(this).css({bottom:numH+1});
		});
		$focus.css({height:settings.height+numH+1});
		//PLAY
		$focus.play(function(i){
			$picList[i].style.display='none';
			$txtList[i].style.display='none';
			$numList[i].className='';
		},function(i){
			$picList.eq(i).fadeIn();
			$txtList[i].style.display='block';
			$numList[i].className='current';
		});
		//Control
		$focus.bindControl($numList);
	}
});