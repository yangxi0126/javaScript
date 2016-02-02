myFocus.pattern.extend({//*********************pithy  这个赞，可以做相册******************
	'mF_pithy_tb':function(settings,$){
		var $focus=$(settings);
		var $picUl=$focus.find('.pic ul');
		$picUl[0].innerHTML+=$picUl[0].innerHTML;//无缝复制
		var $picList=$picUl.find('li');
		var $txtList=$focus.addListTxt().find('li');
		var $thumbBox=$focus.addListThumb();
		var $thumbUl=$thumbBox.find('ul');
		var $thumbList=$thumbUl.find('li');
		var $prevBtn=$focus.addHtml('<div class="prev"><a href="javascript:;">&and;</a></div>');
		var $nextBtn=$focus.addHtml('<div class="next"><a href="javascript:;">&or;</a></div>');
		var $prevBtn2=$focus.addHtml('<div class="prev-2"></div>');
		var $nextBtn2=$focus.addHtml('<div class="next-2"></div>');
		//CSS
		var p=settings,
			showNum=p.thumbShowNum,
			thuBoxHeight=p.height-p.thumbBtnHeight*2,
			thuHeight=Math.round(thuBoxHeight/showNum),
			n=$txtList.length;
		$focus[0].style.width=p.width+p.thumbWidth+'px';
		$picList.each(function(){this.style.height=p.height+'px'});
		$thumbBox.css({width:p.thumbWidth,height:thuBoxHeight,top:p.thumbBtnHeight});
		$thumbList.each(function(){this.style.height=thuHeight+'px'});
		$thumbBox.find('img').each(function(){$(this).css({height:thuHeight-12,width:p.thumbWidth-21})});//减去padding+margin+border
		$prevBtn[0].style.height=$nextBtn[0].style.height=p.thumbBtnHeight+'px';//暂时不用
		$prevBtn2.css({left:0.86*p.width});
		$nextBtn2.css({left:0.86*p.width+23});
		//PLAY
		$focus.play(function(i){
			var index=i>=n?(i-n):i;
			$txtList[index].style.display='none';
			$thumbList[index].className = '';
		},function(i){
			var index=i>=n?(i-n):i;
			$picUl.slide({top:-settings.height*i},600);
			$txtList[index].style.display='block';
			$thumbList.scrollTo(index)[index].className = 'current';
		},p.seamless);
		//Control
		p.trigger='click';//trigger限定为click
		$focus.bindControl($thumbList);
		//Prev & Next
		$prevBtn2.bind('click',function(){$focus.run('-=1')});
		$nextBtn2.bind('click',function(){$focus.run('+=1')});
	}
});
myFocus.config.extend({
	'mF_pithy_tb':{//可选个性参数
		seamless:true,//是否无缝，可选：true(是) | false(否)
		txtHeight:38,//标题高度
		thumbShowNum:4,//略缩图显示数目
		thumbBtnHeight:0,//略缩图导航(prev/next)按钮的高度
		thumbWidth:112//略缩图总宽度
	}
});