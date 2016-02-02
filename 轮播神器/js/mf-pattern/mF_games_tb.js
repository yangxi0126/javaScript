myFocus.pattern.extend({//*********************games下面带小图片的轮播******************
	'mF_games_tb':function(settings,$){
		var $focus=$(settings);
		var $picBox=$focus.find('.pic');
		var $picList=$picBox.find('li');
		var $txtList=$focus.addListTxt().find('li');
		var $thumbBox=$focus.addListThumb();
		var $thumbUl=$thumbBox.find('ul');
		var $thumbList=$thumbUl.find('li');
		var $prevBtn=$focus.addHtml('<div class="prev"><a href="javascript:;">&#8249;</a></div>');
		var $nextBtn=$focus.addHtml('<div class="next"><a href="javascript:;">&#8250;</a></div>');
		//CSS
		var p=settings,showNum=p.thumbShowNum,thuBoxWidth=p.width-p.thumbBtnWidth*2,thuWidth=Math.round(thuBoxWidth/showNum),n=$picList.length;
		$focus[0].style.height=p.height+p.thumbHeight+'px';
		$thumbBox.css({width:thuBoxWidth,height:p.thumbHeight,left:p.thumbBtnWidth});
		$thumbUl.css({width:thuWidth*n});
		$thumbList.each(function(){this.style.width=thuWidth+'px'});
		$thumbBox.find('img').each(function(){this.style.height=(p.thumbHeight-13*2)+'px';});//10px margin+3px border
		$txtList.each(function(){this.style.bottom=p.thumbHeight+'px'});
		//PLAY
		$focus.play(function(i){
			$picList[i].style.display='none';
			$txtList[i].style.display='none';
			$thumbList[i].className = '';
		},function(i){
			$picList.eq(i).fadeIn();
			$txtList[i].style.display='block';
			$thumbList.scrollTo(i)[i].className = 'current';
		});
		//Control
		p.trigger='click';//让其仅支持'click'点击
		$focus.bindControl($thumbList);
		//Prev & Next
		$prevBtn.bind('click',function(){$focus.run('-=1')});
		$nextBtn.bind('click',function(){$focus.run('+=1')});
	}
});
myFocus.config.extend({
	'mF_games_tb':{//可选个性参数
		thumbShowNum:3,//略缩图显示数目
		thumbBtnWidth:16,//略缩图导航(prev/next)按钮的宽度
		thumbHeight:86//略缩图总高度
	}
});