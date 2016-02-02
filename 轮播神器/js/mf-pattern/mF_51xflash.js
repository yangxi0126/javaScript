myFocus.pattern.extend({//*********************51xflash(仅支持4帧)******************该pattern下，只支持点击模式
	'mF_51xflash':function(settings,$){
		var o=document.getElementById(settings.id),list=o.getElementsByTagName('li');
		for(var j=0,len=list.length;j<len;j++){
			if(j>=5) list[j].parentNode.removeChild(list[j]);  //默认是if(j>=4) list[j].parentNode.removeChild(list[j]);大于4张图片后面的被删除
		}
		var $focus=$(settings);
		var $picBox=$focus.find('.pic');
		var $picUl=$picBox.find('ul');
		var $picList=$picUl.find('li');
		var $txtList=$focus.addListTxt().find('li');
		var $playBtn=$focus.addHtml('<div class="play"></div>');  //这里是控制自动播放按钮的位置，不想要注释了就是了。如果不想要文字层，在html配置就行了。
		//CSS  默认是pad=4
		var pad=5,w=(settings.width/3),h=(settings.height-pad*2)/4,disX=w+pad,disY=h+pad,txtH=settings.txtHeight;
		$focus[0].style.cssText='width:'+(settings.width+disX)+'px;height:'+(settings.height+50+'px;');//焦点图盒子  这里设置焦点图盒子的高度  默认是height:'+(settings.height+txtH+(txtH===0?0:pad))+'px;'
		$picBox[0].style.cssText='width:'+(settings.width+disX)+'px;height:'+settings.height+'px;';//图片盒子
		for(var i=0,n=$picList.length;i<n;i++){
			$txtList[i].style.display='none';
			$picList[i].style.cssText='width:'+w+'px;height:'+h+'px;top:'+disY*(i-1)+'px;';
		}
		//PLAY
		$focus.play(function(prev,n){
			$txtList[prev].style.display='none';
		},function(next,n,prev){
			$picList[prev].style.zIndex=2;
			$picList[next].style.zIndex=1;
			$picList.eq(prev).slide({right:0,top:parseInt($picList[next].style.top),width:w,height:h},400,function(){this.style.zIndex=''});
			$picList.eq(next).slide({right:disX,top:0,width:settings.width,height:settings.height},400);
			$txtList[next].style.display='';
		});
		//Control
		settings.trigger='click';//click only  //该pattern下，只支持点击模式
		$focus.bindControl($picList);
		//Toggle Play
		$playBtn.bind('click',function(){
			if($focus.isStop){//to play
				$focus.isStop=false;
				this.className='play';
			}else{//to stop
				$focus.isStop=true;
				this.className='stop';
			}
		});
	}
});
myFocus.config.extend({
	'mF_51xflash':{txtHeight:34}//默认文字层高度
});