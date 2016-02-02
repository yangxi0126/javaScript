myFocus.pattern.extend({//*********************fscreen下面带小图片的轮播******************
	'mF_fscreen_tb':function(settings,$){
		var $focus=$(settings);
		var $picList=$focus.find('.pic li');
		var $txtList=$focus.addListTxt().find('li');
		var $thumbBg=$focus.addHtml('<div class="thumb_bg"></div>');
		var $thumbBox=$focus.addListThumb();
		var $thumbUl=$thumbBox.find('ul');
		var $thumbList=$thumbUl.find('li');
		var $prevBtn=$focus.addHtml('<div class="prev"><a href="javascript:;">&#8249;</a></div>');
		var $nextBtn=$focus.addHtml('<div class="next"><a href="javascript:;">&#8250;</a></div>');
		//CSS
		var p=settings,showNum=p.thumbShowNum,thuBoxWidth=p.width-p.thumbBtnWidth*2,thuWidth=Math.round(thuBoxWidth/showNum),n=$picList.length;
		$thumbBg.css({height:p.thumbHeight});
		$thumbBox.css({width:thuBoxWidth,height:p.thumbHeight,left:p.thumbBtnWidth});
		$thumbUl.css({width:thuWidth*n});
		$thumbList.each(function(){this.style.width=thuWidth+'px'});
		$thumbBox.find('img').each(function(){this.style.height=(p.thumbHeight-9*2)+'px';});//8px margin+1px border
		$txtList.each(function(){this.style.left=-settings.width+'px'});
		//PLAY
		$focus.play(function(i,n){
			$txtList.eq(i).stop().css({left:-settings.width});
			$picList[i].style.display='none';
			$thumbList[i].className='';
		},function(i,n){
			$picList.eq(i).fadeIn(300,function(){
				$txtList.eq(i).slide({left:0});
			});
			$thumbList[i].className='current';
			$thumbList.scrollTo(i);
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
	'mF_fscreen_tb':{//可选个性参数
		thumbShowNum:3,//略缩图显示数目
		thumbBtnWidth:28,//略缩图导航(prev/next)按钮的宽度
		thumbHeight:72//略缩图总高度
	}
});