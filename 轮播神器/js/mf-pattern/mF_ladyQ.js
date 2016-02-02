myFocus.pattern.extend({//*********************ladyQ没什么好说的，这个一般******************
	'mF_ladyQ':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
		var $bar=$focus.addHtml('<div class="time_bar"></div>');
		//CSS
		var n=$picList.length,numH=28,barW=settings.width-23*n-6;
		$focus[0].style.height=settings.height+numH+'px';
		$bar[0].style.cssText='top:'+(settings.height+4)+'px;width:'+barW+'px;'+(settings.timeBar?'':'display:none');
		for(var i=0;i<n;i++) $txtList[i].style.bottom=numH-1+'px';
		//PLAY
		var over=false,start=true,t=settings.time*1000,params={isRunning:false};
		$focus.play(function(i){
			params.isRunning=true;
			$txtList[i].className='';
			$numList[i].className='';
			if(settings.timeBar) $bar.stop()[0].style.width=barW+'px';
			if(settings.timeBar&&!over) $bar.slide({width:0},t,'linear');
		},function(i){
			$picList.eq(i).css({zIndex:1}).fadeIn(600,'swing',function(){
				$picList.each(function(){this.style.display='none'});
				this.style.cssText='z-index:"";display:block';
				params.isRunning=false;
			});
			$txtList[i].className='current';
			$numList[i].className='current',start=false;
		});
		//Control
		$focus.bindControl($numList,params);
		//Stop time bar event
		if(settings.timeBar){
			$focus.bind('mouseover',function(){$bar.stop()[0].style.width=barW+'px',over=true;});
			$focus.bind('mouseout',function(){$bar.slide({width:0},t,'linear'),over=false;});
		}
	}
});
myFocus.config.extend({
	'mF_ladyQ':{//��ѡ���Բ���
		txtHeight:58,//Ĭ�ϱ���߶�
		timeBar:false//�Ƿ���ʱ����[true(��)|false(��)]
	}
});