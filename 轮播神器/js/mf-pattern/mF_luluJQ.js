myFocus.pattern.extend({//*********************luluJQ  这个就是一个推拉门******************
	'mF_luluJQ':function(settings,$){
		var $focus=$(settings);
		$focus.find('.pic a').each(function(){
			var $o=$(this),txt=$o.find('img')[0].alt;
			$o.addHtml('<span><b>'+txt+'</b><i></i></span>');
		});
		var $picBox=$focus.find('.pic');
		var $picList=$focus.find('li');
		var $imgList=$picBox.find('img');
		var $txtList=$focus.find('span');
		var $txtBgList=$focus.find('i');
		//CSS
		var n=$picList.length,tabW=settings.tabWidth,txtH=settings.txtHeight,o=settings.grayOpacity;
		$focus.css({width:settings.width+(n-1)*tabW});
		for(var i=0;i<n;i++){
			if(i>0) $picList[i].style.left=settings.width+(i-1)*tabW+'px';
			$txtList[i].style.cssText=$txtBgList[i].style.cssText='top:0;height:'+txtH+'px;line-height:'+txtH+'px;'
		}
		if(settings.grayChange) $imgList.each(function(){$(this).setOpacity(o)});
		//PLAY
		$focus.play(function(i,n){
			$txtList.eq(i).slide({top:0});
			if(settings.grayChange) $imgList.eq(i).slide({opacity:o},400);
		},function(i,n){
			for(var j=0;j<n;j++){
				if(j<=i) $picList.eq(j).slide({left:j*tabW});
				else $picList.eq(j).slide({left:settings.width+(j-1)*tabW});
			}
			$txtList.eq(i).slide({top:-txtH});
			if(settings.grayChange) $imgList.eq(i).slide({opacity:1},400);
		});
		//Control
		$focus.bindControl($picList);
	}
});
myFocus.config.extend({
	'mF_luluJQ':{//可选个性参数
		tabWidth:68,//图片tab留边宽度(像素)
		txtHeight:34,//文字层高度(像素)
		grayChange:true,//非当前图片是否变暗,可选：true(是) | false(否)
		grayOpacity:0.5//非当前图片的透明度
	}
});