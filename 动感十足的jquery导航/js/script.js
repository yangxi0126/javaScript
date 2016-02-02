$(function() {
/* object to save the initial positions of each box */
var divinfo = {"initial": []};
/* index of the selected / clicked box */
var current = -1;

/* we save the index,top and left of each one of the boxes */
$('#littleBoxes > div').each(function(){
var $this = $(this);
var initial = {
		'index' : $this.index(),
		'top'     : $this.css('top'),
		'left'     : $this.css('left')
};
divinfo.initial.push(initial);
});

/* clcik event for the anchors inside of the boxes */
$('#littleBoxes a').bind('click',function(e){
var $this         = $(this);
var $currentBox    = $this.parent();
/* set a z-index lower than all the other boxes,
to see the other boxes animation on the top*/
$currentBox.css('z-index','1');

/* if we are clicking on a expanded box : */
if(current == $currentBox.index()){
	/* put it back (decrease width,height, and set the top and left like it was before).
	the previous positions are saved in the divinfo obj*/
	$currentBox.stop().animate({
			'top'         : divinfo.initial[$currentBox.index()].top,
			'left'        : divinfo.initial[$currentBox.index()].left,
			'width'     : '90px',
			'height'    : '90px'
	},800,'easeOutBack').find('.boxcontent').fadeOut();


	$('#littleBoxes > div').not($currentBox).each(function(){
		var $ele         = $(this);
		var elemTop     = divinfo.initial[$ele.index()].top;
		var elemLeft     = divinfo.initial[$ele.index()].left;
		$ele.stop().show().animate({
			'top'         : elemTop,
			'left'        : elemLeft,
			'opacity'    : 1
		},800);
	});
	current = -1;
}
/* if we are clicking on a small box : */
else{
	/* randomly animate all the other boxes.
	Math.floor(Math.random()*601) - 150 gives a random number between -150 and 450.
	This range is considering the initial lefts/tops of the elements. It's not the exact right
	range, since we would have to calculate the range based on each one of the boxes. Anyway, it
	fits our needs...
	*/
	$('#littleBoxes > div').not($currentBox).each(function(){
		var $ele = $(this);
		$ele.stop().animate({
			'top' : (Math.floor(Math.random()*601) - 150) +'px',
			'left': (Math.floor(Math.random()*601) - 150) +'px',
			'opacity':0
		},800,function(){
			$(this).hide();
		});
	});

	/* expand the clicked one. Also, fadeIn the content (boxcontent)
	if you want it to fill the space of the littleBoxes container,
	then these are the right values */
	var newwidth     = 379;
	var newheight     = 379;
	$currentBox.stop().animate({
		'top'     : '0px',
		'left'    : '0px',
		'width' : newwidth +'px',
		'height': newheight+'px'
	},800,'easeOutBack',function(){
		current = $currentBox.index();
		$(this).find('.boxcontent').fadeIn();
	});


}
e.preventDefault();
});
});