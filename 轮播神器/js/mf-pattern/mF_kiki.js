myFocus.pattern.extend({//*********************kiki******************
	'mF_kiki':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $numList=$focus.addListNum().find('li');
//      这里修改为自定义左右按钮了，之前丑爆了，同时要修改css文件
        var $prevBtn=$focus.addHtml('<div class="prev"></div>');
        var $nextBtn=$focus.addHtml('<div class="next"></div>');
//		var $navBox=$focus.addHtml('<div class="nav"><a class="prev">PREV</a><span>|</span><a class="next">NEXT</a></div>');  //这里的前后按钮应该可以自定义为图片
//		var $prevBtn=$navBox.find('.prev');
//		var $nextBtn=$navBox.find('.next');
		//CSS
		var d1=settings.width/2,d2=settings.height/2,txtH=settings.txtHeight;
		$focus[0].style.height=settings.height+'px';  //默认为$focus[0].style.height=settings.height+txtH+'px';
		//PLAY
		var s1,s2=1,first=true;
		switch(settings.turn){
			case 'left' :s1=1,s2=1;break;
			case 'right':s1=1,s2=-1;break;
			case 'up'   :s1=2,s2=1;break;
			case 'down' :s1=2,s2=-1;break;
		}
		$focus.play(null,function(next,n,prev){
			$numList[prev].className='',$numList[next].className='current';
			var tt=s1==1?1:(s1==2?2:Math.round(1+(Math.random()*(2-1)))),dis,d,p_s1={},p_s2={},p_e={};
			dis=tt==1?d1:d2,d=s2*dis,p_s1[tt==1?'left':'top']=d,p_s2[tt==1?'left':'top']=-d,p_e[tt==1?'left':'top']=0;
			if(!first) $picList.eq(prev).stop().css({left:0,top:0,zIndex:3});
			if(!first) $picList.eq(next).stop().css({left:0,top:0,zIndex:2});
			$picList.eq(prev).slide(p_s2,300,'linear',function(){
				$txtList[prev].style.display='none',this.style.zIndex=1;
				$(this).slide(p_e,800,function(){
					this.style.zIndex='';
				});
			});
			$picList.eq(next).slide(p_s1,300,'linear',function(){
				$txtList[next].style.display='block',this.style.zIndex=3;
				$(this).slide(p_e,800);
			});
			first=false;
		});
		//Control
		$focus.bindControl($numList);
		//prev & next
		$prevBtn.bind('click',function(){$focus.run('-=1')});
		$nextBtn.bind('click',function(){$focus.run('+=1')});
	}
});
myFocus.config.extend({
	'mF_kiki':{//可选个性参数
		turn:'random',//翻牌方向,可选：'left'(左)|'right'(右)|'up'(上)|'down'(下)|'random'(单向随机)
		txtHeight:30//标题默认高度
	}
});