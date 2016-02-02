/*!
 * jQuery cxCalendar
 * @name jquery.cxcalendar.js
 * @version 1.4.1
 * @date 2014-01-15
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxCalendar
 * @license Released under the MIT license
 */
(function(factory){
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    };
}(function($){
	$.cxCalendar = function(){
		var obj;
		var settings;
		var callback;
		var calendar = {
			dom: {},
			api: {}
		};

		// 检测是否为 DOM 元素
		var isElement = function(o){
			if(o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
				return true;
			} else {
				return (o && o.nodeType && o.nodeType === 1) ? true : false;
			};
		};

		// 检测是否为 jQuery 对象
		var isJquery = function(o){
			return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
		};

		// 检测是否为数组
		var isArray = function(o){
			if(!Array.isArray) {
				return Object.prototype.toString.call(o) === "[object Array]";
			} else {
				return Array.isArray(o);
			};
		};
		
		// IE8 以下版本
		var isIE = !+'\v1';
		
		// 正则
		var ieDateReg = /^(\d+)[-.](\d+)[-.](\d+)$/;
		var testNumberReg = /^\d+$/;

		// 分配参数
		for (var i = 0, l = arguments.length; i < l; i++) {
			if (isJquery(arguments[i])) {
				obj = arguments[i];
			} else if (isElement(arguments[i])) {
				obj = $(arguments[i]);
			} else if (typeof arguments[i] === 'function') {
				callback = arguments[i];
			} else if (typeof arguments[i] === 'object') {
				settings = arguments[i];
			};
		};

		if (obj.length < 1) {return};

		calendar.init = function(){
			var _this = this;

			_this.dom.el = obj;

			_this.settings = $.extend({}, $.cxCalendar.defaults, settings, {
				startDate: _this.dom.el.data('startDate'),
				endDate: _this.dom.el.data('endDate'),
				type: _this.dom.el.data('type'),
				wday: _this.dom.el.data('wday'),
				position: _this.dom.el.data('position'),
				baseClass: _this.dom.el.data('baseClass'),
				language: _this.dom.el.data('language')
			});

			if (_this.dom.el.val().length) {
				if (isIE && ieDateReg.test(_this.dom.el.val())) {
					_this.settings.date = _this.dom.el.val().replace(/[\.\-]/g, '/');
				} else {
					_this.settings.date = _this.dom.el.val();
				};
			};

			_this.setOptions();
			_this.build(true);

			_this.api = {
				show: function(){
					_this.show();
				},
				hide: function(){
					_this.hide();
				},
				getDate: function(){
					return _this.getDate.apply(_this, arguments);
				},
				setDate: function(){
					_this.setDate.apply(_this, arguments);
				},
				gotoDate: function(){
					_this.gotoDate.apply(_this, arguments);
				},
				clearDate: function(){
					_this.clearDate();
				},
				setOptions: function(){
					_this.setOptions.apply(_this, arguments);
					_this.build();
				}
			};

			if (typeof callback === 'function') {
				callback(_this.api);
			};
		};

		// 获取当年每月的天数
		calendar.getMonthDay = function(year){
			var leapYearDay = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 1 : 0;

			return [31, 28 + leapYearDay, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		};

		// 转换日期为对象
		calendar.formatDate = function(style, time){
			if (typeof style !== 'string' || time === 'undefined') {return};

			if (typeof time === 'string') {
				time = time.replace(/[\.-]/g, '/');
			};

			var date = new Date(time);
			var attr = {};

			if (isNaN(date.getTime())) {return};

			attr.yyyy = date.getFullYear();
			attr.yy = attr.yyyy.toString(10).slice(-2);
			attr.m = date.getMonth() + 1;
			attr.mm = (attr.m < 10) ? '0' + attr.m : attr.m;
			attr.d = date.getDate();
			attr.dd = (attr.d < 10) ? '0' + attr.d : attr.d;
			attr.time = date.getTime();
			attr.string = date.toDateString();

			style = style.replace(/STRING/g, attr.string);
			style = style.replace(/TIME/g, attr.time);
			style = style.replace(/YYYY/g, attr.yyyy);
			style = style.replace(/YY/g, attr.yy);
			style = style.replace(/MM/g, attr.mm);
			style = style.replace(/M/g, attr.m);
			style = style.replace(/DD/g, attr.dd);
			style = style.replace(/D/g, attr.d);

			return style;
		};

		// 获取语言配置
		calendar.getLanguage = function(name){
			if (typeof name === 'object') {
				return name;

			} else {
				if (typeof name === 'string') {
					name = name.toLowerCase()
				} else if (typeof navigator.language === 'string') {
					name = navigator.language.toLowerCase();
				} else if (typeof navigator.browserLanguage === 'string') {
					name = navigator.browserLanguage.toLowerCase();
				};

				if (typeof name === 'string' && typeof $.cxCalendar.languages[name] === 'object') {
					return $.cxCalendar.languages[name];
				} else {
					return $.cxCalendar.languages['default'];
				};
			};
		};

		// 配置参数
		calendar.setOptions = function(opts){
			var _this = this;
			var _minDate, _maxDate, _defDate;

			if (typeof opts === 'object') {
				$.extend(_this.settings, opts);
			};

			// 最大、最小日期
			if (typeof _this.settings.startDate === 'number' && _this.settings.startDate <= 9999) {
				_minDate = new Date(_this.settings.startDate, 0, 1);
			} else {
				_minDate = new Date(_this.settings.startDate);
			};

			if (typeof _this.settings.endDate === 'number' && _this.settings.endDate <= 9999) {
				_maxDate = new Date(_this.settings.endDate, 11, 31);
			} else {
				_maxDate = new Date(_this.settings.endDate);
			};
			
			if (isNaN(_minDate.getTime()) || isNaN(_maxDate.getTime()) || _minDate.getFullYear() > _maxDate.getFullYear()) {
				_minDate = new Date($.cxCalendar.defaults.startDate, 0, 1);
				_maxDate = new Date($.cxCalendar.defaults.endDate, 11, 31);
			};

			_this.minDate = {
				year: _minDate.getFullYear(),
				month: _minDate.getMonth() + 1,
				time: _minDate.getTime()
			};
			_this.maxDate = {
				year: _maxDate.getFullYear(),
				month: _maxDate.getMonth() + 1,
				time: _maxDate.getTime()
			};

			// 默认日期
			if (typeof _this.settings.date === 'number' && _this.settings.date <= 9999) {
				_defDate = new Date(_this.settings.date, 0, 1);
			} else {
				_defDate = new Date(_this.settings.date);
			};

			if (isNaN(_defDate.getTime())) {
				_defDate = new Date();
			};

			if (_defDate.getTime() < _this.minDate.time) {
				_this.defDate = $.extend({}, _this.minDate);
			} else if (_defDate.getTime() > _this.maxDate.time) {
				_this.defDate = $.extend({}, _this.maxDate);
			} else {
				_this.defDate = {
					year: _defDate.getFullYear(),
					month: _defDate.getMonth() + 1,
					time: _defDate.getTime()
				};
			};

			// 周末的位置
			_this.settings.saturday = 6 - _this.settings.wday;
			_this.settings.sunday = (7 - _this.settings.wday >= 7) ? 0 : (7 - _this.settings.wday);

			// 语言配置
			_this.language = _this.getLanguage(_this.settings.language);
			
			// 统计节假日
			if (isArray(_this.language.holiday) && _this.language.holiday.length) {
				_this.holiday = {};
				for (var i = 0, l = _this.language.holiday.length; i < l; i++) {
					_this.holiday[_this.language.holiday[i].day] = _this.language.holiday[i].name;
				};
			} else {
				_this.holiday = false;
			};
		};

		// 创建面板
		calendar.build = function(isFirst){
			var _this = this;
			var _html;
			
			if (isFirst === true) {
				_this.dom.pane = $('<div></div>', {'class': 'cxcalendar'});
				_this.dom.paneHd = $('<div></div>', {'class': 'cxcalendar_hd'}).appendTo(_this.dom.pane);
				_this.dom.paneBd = $('<div></div>', {'class': 'cxcalendar_bd'}).appendTo(_this.dom.pane);
	
				_this.dom.paneHd.html('<a class="prev" href="javascript://" rel="prev"></a><a class="next" href="javascript://" rel="next"></a>');
				_this.dom.dateTxt = $('<div></div>', {'class': 'intxt'}).appendTo(_this.dom.paneHd);
				_this.dom.dateSet = $('<div></div>', {'class': 'inset'}).appendTo(_this.dom.paneHd);
				
				_this.dom.yearSet = $('<select></select>', {'class': 'year'}).appendTo(_this.dom.dateSet);
				_this.dom.monthSet = $('<select></select>', {'class': 'month'}).appendTo(_this.dom.dateSet);
			
				_this.dom.weekSet = $('<ul></ul>', {'class': 'week'}).appendTo(_this.dom.paneBd);
				_this.dom.daySet = $('<ul></ul>', {'class': 'days'}).appendTo(_this.dom.paneBd);
			};

			// 年份选择框
			_html = '';
			for (var i = _this.minDate.year; i <= _this.maxDate.year; i++) {
				_html += '<option value="' + i + '">' + i + '</option>';
			};
			_this.dom.yearSet.html(_html).val(_this.defDate.year);

			// 月份选择框
			_html = '';
			for (var i = 0; i < 12; i++) {
				_html += '<option value="' + (i + 1) + '">' + _this.language.monthList[i] + '</option>';
			};
			_this.dom.monthSet.html(_html).val(_this.defDate.month);

			// 星期排序
			_html = '';
			for(var i = 0; i < 7; i++){
				_html += '<li'

				// 高亮周末
				if (i === _this.settings.saturday) {
					_html += ' class="sat"';
				} else if(i === _this.settings.sunday) {
					_html += ' class="sun"';
				};

				_html += '>';
				_html += (i + _this.settings.wday < 7) ? _this.language.weekList[i + _this.settings.wday] : _this.language.weekList[i + _this.settings.wday - 7];
				_html += '</li>';
			};
			_this.dom.weekSet.html(_html);

			// 基础样式
			if (typeof _this.settings.baseClass === 'string') {
				_this.dom.pane.attr('class', 'cxcalendar');
				_this.dom.pane.addClass(_this.settings.baseClass);
			};

			_this.gotoDate(_this.defDate.year, _this.defDate.month);

			if (isFirst === true) {
				// 面板及背景遮挡层插入到页面中
				_this.dom.pane.appendTo('body');
				_this.dom.blockBg = $('<div></div>', {'class': 'cxcalendar_lock'}).appendTo('body');
				_this.bindEvents();
			};
		};

		// 绑定事件
		calendar.bindEvents = function(){
			var _this = this;

			// 显示面板
			_this.dom.el.on('click', function(){
				_this.show();
			});

			// 关闭面板
			_this.dom.blockBg.on('click', function(){
				_this.hide();
			});

			// 显示年月选择
			_this.dom.dateTxt.on('click', function(){
				_this.dom.dateTxt.hide();
				_this.dom.dateSet.show();
			});

			// 更改年月
			_this.dom.yearSet.on('change', function(){
				_this.gotoDate(parseInt(_this.dom.yearSet.val(), 10), parseInt(_this.dom.monthSet.val(), 10));
			});
			_this.dom.monthSet.on('change', function(){
				_this.gotoDate(parseInt(_this.dom.yearSet.val(), 10), parseInt(_this.dom.monthSet.val(), 10));
			});
			_this.dom.pane.on('click', 'a', function(){	
				var _rel = this.rel;

				switch(_rel){
					case 'prev':
						_this.gotoDate(parseInt(_this.dom.yearSet.val(), 10), parseInt(_this.dom.monthSet.val(), 10) - 1);
						return false;
						break;
					
					case 'next':
						_this.gotoDate(parseInt(_this.dom.yearSet.val(), 10), parseInt(_this.dom.monthSet.val(), 10) + 1);
						return false;
						break;
					
					// not undefined
				};
			});

			// 选择日期
			_this.dom.daySet.on('click', 'li', function(){
				var _li = $(this);

				if (_li.hasClass('del')) {return};

				_this.setDate(_li.data('year'), _li.data('month'), _li.data('day'));
			});
		};
		
		// 重新构建月份选项
		calendar.rebulidMonthSelect = function(n, m){
			var start = n || 1;
			var end = m || 12;
			var html = '';

			for (var i = start; i <= end; i++) {
				html += '<option value="' + i + '">' + this.language.monthList[i - 1] + '</option>';
			};

			this.dom.monthSet.html(html);
		};

		// 显示日期选择器
		calendar.show = function(){
			var _this = this;
			var _position = _this.settings.position;
			var docWidth = document.body.clientWidth;
			var docHeight = document.body.clientHeight;
			var paneWidth = _this.dom.pane.outerWidth();
			var paneHeight = _this.dom.pane.outerHeight();
			var elTop = _this.dom.el.offset().top;
			var elLeft = _this.dom.el.offset().left;
			var elWidth = _this.dom.el.outerWidth();
			var elHeight = _this.dom.el.outerHeight();
			
			var paneTop = (elTop + paneHeight + elHeight) > docHeight ? elTop - paneHeight : elTop + elHeight;
			var paneLeft = (elLeft + paneWidth) > docWidth ? elLeft - paneWidth - elWidth : elLeft;
			
			if (typeof _position === 'string' && _position.length) {
				switch(_position) {
					case 'top':
						paneTop = elTop - paneHeight;
						break

					case 'topLeft':
					case 'topRight':
						paneTop = elTop - paneHeight;
						paneLeft = _position === 'topLeft' ? elLeft - paneWidth + elWidth : elLeft;
						break

					case 'bottom':
						paneTop = elTop + elHeight;
						break

					case 'bottomLeft':
					case 'bottomRight':
						paneTop = elTop + elHeight;
						paneLeft = _position === 'bottomLeft' ? elLeft - paneWidth + elWidth : elLeft;
						break

					case 'left':
					case 'right':
						paneTop = ((elTop + paneHeight + elHeight) > docHeight) ? elTop + elHeight - paneHeight : elTop;
						paneLeft = _position === 'left' ? elLeft - paneWidth : elLeft + elWidth;
						break

					case 'leftTop':
					case 'leftBottom':
						paneTop = _position === 'leftTop' ? elTop + elHeight - paneHeight : elTop;
						paneLeft = elLeft - paneWidth;
						break

					case 'rightTop':
					case 'rightBottom':
						paneTop = _position === 'rightTop' ? elTop + elHeight - paneHeight : elTop;
						paneLeft = elLeft + elWidth;
						break

					// not default
				};
			};

			// 防止浏览器刷新缓存文字内容
			_this.dom.dateTxt.html('<span class="y">' + _this.dom.yearSet.val() + '</span><span class="m">' + _this.language.monthList[_this.dom.monthSet.val() - 1] + '</span>');
			_this.dom.pane.css({'top': paneTop, 'left': paneLeft}).show();
			_this.dom.blockBg.css({width: docWidth, height: docHeight}).show();
		};

		// 隐藏日期选择器
		calendar.hide = function(){
			var _this = this;

			_this.dom.pane.hide();
			_this.dom.blockBg.hide();
			_this.dom.dateSet.hide();
			_this.dom.dateTxt.show();
		};

		// 获取当前选中日期
		calendar.getDate = function(style){
			var _this = this;
			var _value = _this.dom.el.val();

			if (_value.length) {
				if (typeof style === 'string') {
					_value = _this.formatDate(style, _value);
				} else {
					_value = _this.formatDate(_this.settings.type, _value);
				};
			};

			return _value;
		};

		// 跳转到日期
		calendar.gotoDate = function(year, month){
			var _this = this;
			var _theDate, _theYear, _theMonth;

			if (typeof year === 'number' && year <= 9999 && typeof month === 'number') {
				_theDate = new Date(year, month - 1, 1);
			} else {
				_theDate = new Date(year);
			};

			_theYear = _theDate.getFullYear();
			_theMonth = _theDate.getMonth() + 1;
			_theTime = _theDate.getTime();

			if (_theYear < _this.minDate.year || (_theYear <= _this.minDate.year && _theMonth < _this.minDate.month)) {
				_theYear = _this.minDate.year;
				_theMonth = _this.minDate.month;
			} else if (_theYear > _this.maxDate.year || (_theYear >= _this.maxDate.year && _theMonth > _this.maxDate.month)) {
				_theYear = _this.maxDate.year;
				_theMonth = _this.maxDate.month;
			};

			if (_theYear === _this.minDate.year && _theYear === _this.maxDate.year) {
				_this.rebulidMonthSelect(_this.minDate.month, _this.maxDate.month);
			} else if (_theYear === _this.minDate.year) {
				_this.rebulidMonthSelect(_this.minDate.month, 12);
			} else if (_theYear === _this.maxDate.year) {
				_this.rebulidMonthSelect(1, _this.maxDate.month);
			} else {
				_this.rebulidMonthSelect();
			};

			var _jsMonth = _theMonth - 1;
			var _monthDays = _this.getMonthDay(_theYear);
			var _sameMonthDate = new Date(_theYear, _jsMonth, 1);
			var _nextMonthDate = new Date(_theYear, _theMonth, 1);
			var _nowDate = new Date();
			var _nowYear = _nowDate.getFullYear();
			var _nowMonth = _nowDate.getMonth() + 1;
			var _nowDay = _nowDate.getDate();
			var _inputValue = _this.dom.el.val();
			var _valDate, _valYear, _valMonth, _valDay;
			
			if (_inputValue.length) {
				if (testNumberReg.test(_inputValue)) {
					_inputValue = parseInt(_inputValue, 10);
				};
				_valDate = new Date(_inputValue);

				if (!isNaN(_valDate.getTime())) {
					_valYear = _valDate.getFullYear();
					_valMonth = _valDate.getMonth() + 1;
					_valDay = _valDate.getDate();
				};
			};

			// 获取当月第一天
			var _firstDay = _sameMonthDate.getDay() - _this.settings.wday;
			if (_firstDay < 0) {
				_firstDay += 7;
			};
			var _dayMax = Math.ceil((_monthDays[_jsMonth] + _firstDay) / 7) * 7;

			var _todayNum, _todayYear, _todayMonth, _todayTime;
			var _class, _title, _html = '';

			for (var i = 0; i < _dayMax; i++) {
				_title = '';
				_class = [];
				_todayYear = _theYear;
				_todayMonth = _theMonth;
				_todayNum = i - _firstDay + 1;
				
				// 填充上月和下月的日期
				if (_todayNum <= 0) {
					_class.push('other');

					if (_todayMonth <= 1) {
						_todayYear--;
						_todayMonth = 12;
						_todayNum = _monthDays[11] + _todayNum;
					} else {
						_todayMonth--;
						_todayNum = _monthDays[_jsMonth - 1] + _todayNum;
					};

				} else if (_todayNum > _monthDays[_jsMonth]) {
					_class.push('other');

					if (_todayMonth >= 12) {
						_todayYear++;
						_todayMonth = 1;
						_todayNum = _todayNum - _monthDays[0];
					} else {
						_todayMonth++;
						_todayNum -= _monthDays[_jsMonth];
					};
				};

				_todayTime = new Date(_todayYear, _todayMonth - 1, _todayNum).getTime();

				// 高亮选中日期、今天
				if (typeof _valDate === 'object' && _todayYear === _valYear && _todayMonth === _valMonth && _todayNum === _valDay) {
					_class.push('selected');
				} else if (_todayYear === _nowYear && _todayMonth === _nowMonth && _todayNum === _nowDay) {
					_class.push('now');
				};

				// 高亮周末
				if (i % 7 ===_this.settings.saturday) {
					_class.push('sat');
				} else if (i % 7 === _this.settings.sunday) {
					_class.push('sun');
				};
				
				// 超出范围的无效日期
				if (_todayTime < _this.minDate.time || _todayTime > _this.maxDate.time) {
					_class.push('del');
				};

				// 判断是否有节假日
				if (_this.holiday) {
					if (typeof _this.holiday['M' + _todayMonth + '-' + _todayNum] === 'string') {
						_class.push('holiday');
						_title = _this.holiday['M' + _todayMonth + '-' + _todayNum];
					} else if (typeof _this.holiday['D' + _todayYear + '-' + _todayMonth + '-' + _todayNum] === 'string') {
						_class.push('holiday');
						_title = _this.holiday['D' + _todayYear + '-' + _todayMonth + '-' + _todayNum];
					} else {
						_title = _todayYear + '-' + _todayMonth + '-' + _todayNum;
					};
				} else {
					_title = _todayYear + '-' + _todayMonth + '-' + _todayNum;
				};

				_html += '<li';
				if (_class.length) {
					_html += ' class="' + _class.join(' ') + '"';
				};
				_html += ' title="' + _title + '"';
				_html += ' data-year="' + _todayYear + '" data-month="' + _todayMonth + '" data-day="' + _todayNum + '">' + _todayNum + '</li>';
			};

			_this.dom.daySet.html(_html);
			_this.dom.dateTxt.html('<span class="y">' + _theYear + '</span><span class="m">' + _this.language.monthList[_jsMonth] + '</span>');
			_this.dom.yearSet.val(_theYear);
			_this.dom.monthSet.val(_theMonth);
			
			return this;
		};

		// 设置日期
		calendar.setDate = function(year, month, day){
			var _this = this;
			var _todayDate, _todayYear, _todayMonth, _todayValue;

			if (typeof year === 'number' && year <= 9999 && typeof month === 'number' && typeof day === 'number') {
				_todayDate = new Date(year, month - 1, day);
			} else {
				_todayDate = new Date(year);
			};

			if (isNaN(_todayDate.getTime())) {return};

			_todayYear = _todayDate.getFullYear();
			_todayMonth = _todayDate.getMonth() + 1;
			_todayTime = _todayDate.getTime();

			_todayValue = _this.formatDate(_this.settings.type, _todayTime);

			_this.dom.el.val(_todayValue).trigger('change');
			_this.hide();
			_this.gotoDate(_todayYear, _todayMonth);
		};
		
		// 清除日期
		calendar.clearDate = function(){
			this.dom.el.val('');
			this.hide();
		};

		calendar.init();

		return this;
	};
	
	// 默认值
	$.cxCalendar.defaults = {
		startDate: 1950,		// 开始日期
		endDate: 2030,			// 结束日期
		date: undefined,		// 默认日期
		type: 'YYYY-MM-DD',		// 日期格式
		wday: 0,				// 星期开始于周几
		position: undefined,
		baseClass: undefined,	// 基础样式
		language: undefined		// 语言
	};
	$.cxCalendar.languages = {
		'default': {
			monthList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
			weekList: ['日', '一', '二', '三', '四', '五', '六'],
			holiday: []
		}
	};

	$.fn.cxCalendar = function(settings, callback){
		this.each(function(i){
			$.cxCalendar(this, settings, callback);
		});
		return this;
	};
}));