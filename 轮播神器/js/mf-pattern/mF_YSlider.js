myFocus.pattern.extend({//*********************YSlide--翻页效果  这个也没有左右******************
	'mF_YSlider':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $rePicList=$focus.addHtml('<div class="rePic">'+$focus.find('.pic').html()+'</div>').find('li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
		//PLAY
		var s=settings.direction==='single'?true:false,d1=settings.width,d2=settings.height;
		$focus.play(function(i,n){
			var r=s?1:Math.round(1+(Math.random()*(2-1))),dis,d,p={};
			dis=r===1?d1:d2,d=Math.round(Math.random()+s)?dis:-dis,p[r===1?'left':'top']=d;
			$picList[i].style.display=$txtList[i].style.display='none';
			$numList[i].className='';
			$rePicList.eq(i).css({left:0,top:0,display:'block',opacity:1}).slide(p,500,'swing').fadeOut(500);
		},function(i,n){
			$picList[i].style.display=$txtList[i].style.display='block';
			$numList[i].className='current';
		});
		//Control
		$focus.bindControl($numList);
	}
});
myFocus.config.extend({'mF_YSlider':{direction:'random'}});//切出方向,可选：'random'(随机) | 'single'(单向/向右)