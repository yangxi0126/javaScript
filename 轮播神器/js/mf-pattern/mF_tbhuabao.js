myFocus.pattern.extend({//*********************tbhuabao 一般轮播******************
	'mF_tbhuabao':function(settings,$){
		var $focus=$(settings);
		var $picBox=$focus.find('.pic');
		var $picUl=$picBox.find('ul');
		$picUl[0].innerHTML+=$picUl[0].innerHTML;//无缝复制
		var $txtList=$focus.addListTxt().find('li');
		var $dotList=$focus.addList('dot').find('li');
		$dotList.each(function(){this.innerHTML='<a href="javascript:;">&bull;</a>'});//小点
		var $prevBtn=$focus.addHtml('<div class="prev"><a href="javascript:;">&#8249;</a></div>');
		var $nextBtn=$focus.addHtml('<div class="next"><a href="javascript:;">&#8250;</a></div>');
		//CSS
		var w=settings.width,h=settings.height,dotH=32,arrTop=h/2-32,n=$txtList.length;
		$focus[0].style.height=h+dotH+'px';
		$picBox[0].style.cssText='width:'+w+'px;height:'+h+'px;';
		$picUl[0].style.width=w*2*n+'px';
		$txtList.each(function(){this.style.bottom=dotH+'px'});
		$picUl.find('li').each(function(){this.style.cssText='width:'+w+'px;height:'+h+'px;'});//滑动固定其大小
		$prevBtn[0].style.cssText=$nextBtn[0].style.cssText='top:'+arrTop+'px;';
		//PLAY
		$focus.play(function(i){
			var index=i>=n?(i-n):i;
			$txtList[index].style.display='none';
			$dotList[index].className = '';
		},function(i){
			var index=i>=n?(i-n):i;
			$picUl.slide({left:-w*i});
			$txtList[index].style.display='block';
			$dotList[index].className = 'current';
		},settings.seamless);
		//Control
		$focus.bindControl($dotList);
		//Prev & Next
		$prevBtn.bind('click',function(){$focus.run('-=1')});
		$nextBtn.bind('click',function(){$focus.run('+=1')});
	}
});
myFocus.config.extend({'mF_tbhuabao':{seamless:true}});//支持无缝设置