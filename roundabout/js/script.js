$(document).ready(function(){
//  控制旋转
    $('#img-slider li').bind({
        reposition: function() {
            var degrees = $(this).data('roundabout').degrees,
                roundaboutBearing = $(this).parent().data('roundabout').bearing,
                rotateY = Math.sin((roundaboutBearing - degrees) * (Math.PI/180)) * 9;
            $(this).css({
                "-webkit-transform": 'rotate(' + rotateY + 'deg)',
                "-moz-transform": 'rotate(' + rotateY + 'deg)',
                "-ms-transform": 'rotate(' + rotateY + 'deg)',
                "-o-transform": 'rotate(' + rotateY + 'deg)',
                "transform": 'rotate(' + rotateY + 'deg)'
            });
        }
    });
    $('.jQ_sliderPrev').on('click', function(){
        $('#img-slider').roundabout('animateToNextChild');
        return false;
    });
    $('.jQ_sliderNext').on('click', function(){
        $('#img-slider').roundabout('animateToPreviousChild');
        return false;
    });
//  添加键盘左右事件
    $('body').on('keyup', function(e) {
        var keyCode = e.which || e.keyCode;
        if(keyCode == 37) {
            $('#img-slider').roundabout('animateToPreviousChild');
            e.preventDefault();
            return false;
        } else if(keyCode == 39) {
            $('#img-slider').roundabout('animateToNextChild');
            e.preventDefault();
            return false;
        }
    });
//  点击小圆点
    $('.jQ_sliderSwitch li').on('click', function() {
        var $elem = $(this);
        var index = $elem.index();
        $('#img-slider').roundabout('animateToChild', index);
        return false;
    });
//  动画效果
    $('#img-slider').roundabout({
        minScale: 0.4,  //Scale控制图片大小
        maxScale: 0.9,
        duration: 450,
        responsive: true,
        //autoplay: true,
        //autoplayPauseOnHover: true,
        btnStopAutoplay: true
    }).bind({
        animationEnd: function(e) {  //动画完回调
            var index = $('#img-slider').roundabout('getChildInFocus');
            $('.jQ_sliderSwitch li').removeClass('active');
            $('.jQ_sliderSwitch li').eq(index).addClass('active');
        }
    });
});