myFocus.pattern.extend({//*********************凡客风格******************这是类似于选项卡的风格
	'mF_dleung':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		//CSS
		var n=$txtList.length,txtW=Math.ceil((settings.width-2*(n-1))/n);
		$txtList.each(function(i){this.style.width=txtW+'px'});
		//PLAY
		$focus.play(function(i){
			$picList.eq(i).fadeOut(200,'easeIn');
			$txtList[i].className = '';
		},function(i){
			$picList.eq(i).fadeIn(500,'easeIn');
			$txtList[i].className = 'current';
		});
		//Control
		$focus.bindControl($txtList);
	}
});