//缓动函数
jQuery.easing["jswing"]=jQuery.easing["swing"];jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d)},easeOutQuad:function(x,t,b,c,d){return -c*(t/=d)*(t-2)+b},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b}}}}});
//扩展 string.format
String.prototype.format = function () {
    var args = arguments;
    var reg = /\{(\d+)\}/g;
    return this.replace(reg, function (g0, g1) {
        return args[+g1];
    });
};

(function ($) {  //jQuery 队列封装
    $.fn.will = function (callBack, type) {
        type = type || "fx";
        return $.each(this, function (index, ele) {
            $(ele).queue(type, function (next) {
                callBack.call(this);
                next();
            });
        });
    };
})(jQuery);

//(function ($) {  // 图片预加载
//    $.preLoad = function (urlArr) {
//        $.each(urlArr, function (index, url) {
//            var img = document.createElement("img");
//            img.src = url;
//        });
//    }
//})(jQuery);

(function ($) {
    function Slider(option) {
        //深拷贝，修改每个对象的属性只能通过对象实例，避免初始化时候外部引用对象的影响
        this.opt = $.extend(true, {}, option);
        this.ele = $("#" + this.opt.id);
        this.inIt();
        this.begin();
    }

    Slider.prototype = {
        cubeSize: { x: 0, y: 0 },               //每一个格子的尺寸
        nowIndex: 0,                        //当前图片索引
        canChose: true,                     //是否可以切换
        nextIndex: function () {            //下一个图片索引
            var newIndex = this.nowIndex + 1;
            if (newIndex >= this.opt.imgs.length) newIndex = 0;
            return newIndex;
        },
        inIt: function () {   //初始化
            this.preLoad();
            this.fill();
            this.resize();
            var self = this;
            $(window).resize(function () {
                self.resize();
            });
        },
        preLoad: function () {
            var arr = this.opt.imgs;
            $.each(arr, function (index, url) {
                var img = document.createElement("img");
                img.src = url;
            });
        },
        begin: function () {
            var self = this;
            this.timer = setInterval(function () {
                var newIndex = self.nowIndex + 1;
                if (newIndex >= self.opt.imgs.length) newIndex = 0;
                self.choseImg(newIndex);
            }, self.opt.interval);
        },
        stop: function () {
            clearInterval(this.timer);
        },
        fill: function () {  //填充模块
            var result = '<div class="slider-box">';
            for (var x = 0; x < this.opt.x; x++) {
                for (var y = 0; y < this.opt.y; y++) {
                    result += '<div id="{0}" class="{1}"><div class="slider_inner_a"></div><div class="slider_inner_b"></div></div>'
                        .format(this.opt.id + "_" + x + "_" + y, "slider_cube");
                }
            }

            //如果显示按钮，插入slider_bar
            if (this.opt.showBar) {
                result += '<div class="slider_bar">';
                result += new Array(this.opt.imgs.length + 1).join('<span></span>');
                result += '</div>';
            }

            result += '</div>';

            this.ele.html(result);
            this.ele.find(".slider_bar span").eq(this.nowIndex).addClass("active");
            this.eleBox = this.ele.children(".slider-box");


            this.bindEvents();
        },
        bindEvents: function () {
            var self = this;

            //绑定slider_bar切换图片
            if (this.opt.showBar) {
                this.eleBox.children(".slider_bar").off().on("click", "span", function () {
                    var eleSpan = $(this);
                    self.choseImg(eleSpan.index());
                });
            }

            if (this.opt.urls.length <= 0) return;  //如果存在跳转链接，点击图片进行跳转，mouseenter和mouseleave会停止、开始轮播
            self.eleBox.find(".slider_cube").off().click(function () {
                window.location.href = self.opt.urls[self.nowIndex] || "javascript:void(0);";
            }).css("cursor", "pointer");

            self.eleBox.off().mouseenter(function () {
                self.stop();
            }).mouseleave(function () {
                self.begin();
            });
        },
        resize: function () { //调整大小，位置
            this.eleBox.height(this.eleBox.width() / this.opt.scale);

            var eleWid = this.eleBox.width(),
                eleHei = this.eleBox.height();

            var xSize, ySize;  //每一小块的size

            if (this.opt.border) { //如果显示间隔
                xSize = (eleWid - this.opt.x + 1) / this.opt.x;
                ySize = (eleHei - this.opt.y + 1) / this.opt.y;
            } else {
                xSize = eleWid / this.opt.x;
                ySize = eleHei / this.opt.y;
            }
            this.cubeSize = { x: xSize, y: ySize };

            if (this.opt.x == 1) xSize = eleWid; //当只有一个模块的时候
            if (this.opt.y == 1) ySize = elehei;

            //位置 position ,图片位置
            var borLen = this.opt.border ? 1 : 0;
            for (var x = 0; x < this.opt.x; x++) {
                for (var y = 0; y < this.opt.y; y++) {
                    $("#" + this.opt.id + "_" + x + "_" + y).css(
                        {
                            "left": x * xSize + x * borLen + "px",
                            "top": y * ySize + y * borLen + "px",
                            "width": xSize + "px",
                            "height": ySize + "px"
                        }
                    ).find(".slider_inner_a,.slider_inner_b").css(
                        {
                            "background-image": "url({0})".format(this.opt.imgs[this.nowIndex]),
                            "background-position": "{0}px {1}px".format(-x * xSize, -y * ySize),
                            "background-size": "{0}px {1}px".format(eleWid, eleHei)
                        });
                }
            }
            //..
        },
        choseImg: function (index) {
            var self = this;

            if (index == self.nowIndex) return;

            if (!self.canChose) return;
            self.canChose = false;
            setTimeout(function () {
                self.canChose = true;
            }, self.opt.delay + 200);
            this.nowIndex = index;
            var url = this.opt.imgs[index];
            //var effectIndex = Math.floor(Math.random() * this.effects.length);
            this.effectIndex = this.effectIndex || 0;
            if (this.effectIndex >= this.effects.length) this.effectIndex = 0;
            this.effects[this.effectIndex](this, url);
            this.effectIndex++;

            //slider_bar active 效果
            if (self.opt.showBar) {
                self.eleBox.children(".slider_bar").find("span").removeClass("active").eq(self.nowIndex).addClass("active");
            }
        },
        effects: [
            function (self, url) {  // 模块依次击地效果
                var delayItem = self.opt.delay / (self.opt.x * self.opt.y);
                effectTemplate(self.opt, function (eleA, eleB, x, y) {
                    eleA.css({
                        "top": -self.cubeSize.y + "px",
                        "background-image": "url({0})".format(url)
                    });
                    var delayTime = (x + (self.opt.x * y)) * delayItem * 4 / 5;
                    eleA.delay(delayTime).animate({
                        "top": "0"
                    }, {
                        duration: delayItem * 10,
                        easing: "easeOutBounce"
                    });
                    eleB.delay(delayTime).animate({
                        "top": self.cubeSize.y + "px"
                    }, {
                        duration: delayItem * 10,
                        easing: "easeOutBounce"
                    }).will(function () {
                        $(this).css({
                            "top": "0",
                            "background-image": "url({0})".format(url)
                        });
                    });
                });
            },
            function (self, url) {  //百叶窗从左到右
                var delayItem = self.opt.delay / self.opt.x;
                effectTemplate(self.opt, function (eleA, eleB, x, y) {
                    eleA.css({
                        "left": -self.cubeSize.x + "px",
                        "background-image": "url({0})".format(url)
                    });
                    var delayTime = x * delayItem;
                    eleA.delay(delayTime).animate({
                        "left": "0"
                    }, {
                        duration: delayItem * 2
                    });
                    eleB.delay(delayTime).animate({
                        "left": self.cubeSize.x + "px"
                    }, {
                        duration: delayItem * 2
                    }).will(function () {
                        $(this).css({
                            "left": "0",
                            "background-image": "url({0})".format(url)
                        });
                    });
                });
            },
            function (self, url) {  // 模块依次渐入
                var delayItem = self.opt.delay / (self.opt.x * self.opt.y);
                effectTemplate(self.opt, function (eleA, eleB, x, y) {
                    eleA.css({
                        "opacity": "0",
                        "background-image": "url({0})".format(url)
                    });
                    var delayTime = (x + (self.opt.x * y)) * delayItem;
                    eleA.delay(delayTime).animate({
                        "opacity": "1"
                    }, {
                        duration: delayItem * 4,
                    });
                    eleB.delay(delayTime).animate({
                        "opacity": "0"
                    }, {
                        duration: delayItem * 4,
                    }).will(function () {
                        $(this).css({
                            "opacity": "1",
                            "background-image": "url({0})".format(url)
                        });
                    });
                });
            },
            function (self, url) {    //乱序随机滑动
                //生成随机延迟时间
                var delayArr = [0];
                var delayItem = self.opt.delay / (self.opt.x * self.opt.y);
                for (var i = 1, len = self.opt.x * self.opt.y; i < len; i++) delayArr[i] = delayArr[i - 1] + delayItem;
                delayArr.sort(function (a, b) {
                    return Math.random() > 0.5 ? 1 : -1;
                });

                effectTemplate(self.opt, function (eleA, eleB, x, y) {
                    //随机方向
                    var directionIndex = Math.floor(Math.random() * 4); //0-上，1-右，2-下，3-左
                    var cssName = ["top", "left", "top", "left"][directionIndex]; //属性名称
                    var cssValue = [-self.cubeSize.y, self.cubeSize.x, self.cubeSize.y, -self.cubeSize.x][directionIndex];//模块一的起始值，模块二的终止值取反

                    var obj = {};
                    obj[cssName] = cssValue + "px";
                    obj["background-image"] = "url({0})".format(url);
                    eleA.css(obj);

                    var delayTime = delayArr[x + y * self.opt.x];
                    obj = {};
                    obj[cssName] = "0";
                    eleA.delay(delayTime * 3 / 4).animate(obj, delayItem * 4);

                    obj = {};
                    obj[cssName] = -cssValue + "px";
                    eleB.delay(delayTime * 3 / 4).animate(obj, delayItem * 4).will(function () {
                        obj = {};
                        obj[cssName] = "0";
                        obj["background-image"] = "url({0})".format(url);
                        $(this).css(obj);
                    });
                });
            }
        ]
    };

    //动画模板辅助方法
    function effectTemplate(opt, callback) {
        for (var y = 0; y < opt.y; y++) {
            for (var x = 0; x < opt.x; x++) {
                var eleBox = $("#{0}_{1}_{2}".format(opt.id, x, y));
                var eleA = eleBox.children(".slider_inner_a");
                var eleB = eleBox.children(".slider_inner_b");
                callback(eleA, eleB, x, y);
            }
        }
    }


    //获取随机id
    function getRandomId() {
        return Math.random().toString(36).substr(2).replace(/\d/g, "");
    }

    $.fn.slider = function (option, obj) {
        if (typeof option == "object") {
            var defaults = {   //默认配置
                imgs: [],       //图片路径数组
                urls: [],         //点击跳转到的链接
                x: 2,          //横向模块数量
                y: 2,          //纵向模块数量
                scale: 4 / 3,      //宽高比
                delay: 800,        //动画时长
                interval: 5000,  //轮显间隔
                border: false   //显示模块间隔
            };

            //jQuery对象是一个伪数组对象，可能有多个元素
            return $.each(this, function (index, ele) {
                // code...

                //最终配置
                var opt = $.extend({}, defaults, option);

                if (!ele.id) {    //给个id，方便方块命名
                    ele.id = getRandomId();
                }
                opt.id = ele.id;

                var slider = new Slider(opt);
                $(ele).data("slider", slider);
            });
        }
        else if (typeof option == "string") {
            var slider = this.data("slider");
            slider.opt = $.extend({}, slider.opt, obj || {});
            slider.inIt();
            slider.stop();
            slider.begin();
            if (typeof obj == "object") slider[option]();
            else slider[option](obj);
            return this;
        } else {
            return this;
        }
    };
})(jQuery);