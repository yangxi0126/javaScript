myFocus.pattern.extend({//*********************搜狐体育 这个一般******************
	'mF_sohusports':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
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