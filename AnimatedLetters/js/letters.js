function Letters(el, options){
    this.el = el;
    this.text = el.innerHTML.toLowerCase();
    el.innerHTML = '<span style="position: absolute; visibility: hidden;">'+ this.text +'</span>';
    this.init(options);
}

Letters.prototype = {
    init: function(options){
        this.size = options && options.hasOwnProperty('size') ? options.size : 100;
        this.weight = options && options.hasOwnProperty('weight') ? options.weight : 1;
        this.rounded = options && options.hasOwnProperty('rounded') ? options.rounded : false;
        this.color = options && options.hasOwnProperty('color') ? options.color : '#5F6062';
        this.duration = options && options.hasOwnProperty('duration') ? options.duration : 1;
        this.delay = options && options.hasOwnProperty('delay') ? options.delay : [0, 0.05];
        this.fade = options && options.hasOwnProperty('fade') ? options.fade : 0.5;
        this.easing = options && options.hasOwnProperty('easing') ? options.easing : d3_ease.easeCubicInOut.ease;
        this.individualDelays = options && options.hasOwnProperty('individualDelays') ? options.individualDelays : false;
        this.visible = false;
        this._svgNS = 'http://www.w3.org/2000/svg';
        this.svgs = [];
        this.timer = [];
        this.segments = [];
        this.drawText();
    },

    drawText: function(){
        this.letters = this.text.replace(/[^a-z ]/g, '').split('');
        var self = this;
        var size = typeof self.size === 'number' ? self.size : self.size[0];
        var weight = typeof self.weight === 'number' ? self.weight : self.weight[0];
        var rounded = typeof self.rounded === 'boolean' ? self.rounded : self.rounded[0];
        var color = typeof self.color === 'string' ? self.color : self.color[0];
        var fade = typeof self.fade === 'number' ? self.fade : self.fade[0];
        self.renderAlphabet = typeof self.weight === 'number' && typeof self.rounded === 'boolean' ? self.initAlphabet(weight, rounded) && false : true;
        var spaces = 0;
        this.letters.forEach(function(element, index){
            size = typeof self.size[index] === 'number' ? self.size[index] : size;
            weight = typeof self.weight[index] === 'number' ? self.weight[index] : weight;
            rounded = typeof self.rounded[index] === 'boolean' ? self.rounded[index] : rounded;
            color = typeof self.color !== 'string' && typeof self.color[index] === 'string' ? self.color[index] : color;
            fade = typeof self.fade[index] === 'number' ? self.fade[index] : fade;
            if(self.renderAlphabet){
                self.initAlphabet(weight, rounded);
            }
            if(element === ' '){
                self.drawLetter(element, index, size);
                spaces++;
            }else{
                self.segments[index - spaces] = self.drawLetter(element, index - spaces, size, weight, rounded, color, fade);
            }
        });
        this.letters = this.text.replace(/[^a-z]/g, '').split('');
    },

    drawLetter: function(letter, index, size, weight, rounded, color, fade){
        if(letter === ' '){
            this.createSVG(this.alphabet[letter].svg, 'space', index, size);
        }else{
            var svg = this.createSVG(this.alphabet[letter].svg, letter, index, size, fade);
            var segments = [];
            var pathsD = this.alphabet[letter].paths;
            var initial = this.alphabet[letter].initial;
            var path;
            var segment;
            var self = this;
            pathsD.forEach(function(element, index){
                path = document.createElementNS(self._svgNS, "path");
                path.setAttribute('d', element);
                path.setAttribute('stroke-width', weight);
                path.setAttribute('stroke-linecap', rounded ? 'round' : 'butt');
                path.setAttribute('stroke', color);
                path.setAttribute('fill', 'none');
                segment = new Segment(path, initial[index].begin, initial[index].end, true);
                segments.push(segment);
                svg.appendChild(path);
            });
            return segments;
        }
    },

    createSVG: function(svgSize, letter, index, size, fade){
        var svg = document.createElementNS(this._svgNS, "svg");
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'img');
        svg.setAttribute('viewBox', '0 0 '+ svgSize.width +' '+ svgSize.height);
        svg.setAttribute('height', size + 'px');
        var width = size * (svgSize.width / svgSize.height);
        svg.setAttribute('width', Math.ceil(width) + 'px');
        svg.setAttribute('class', 'letter letter-' + letter + (letter !== 'space' ? ' letter-' + (index + 1) : ''));
        this.el.appendChild(svg);
        if(letter !== 'space'){
            this.svgs[index] = svg;
            if(fade){
                svg.style.opacity = 0;
                this.setupFade(fade, index);
            }
            return svg;
        }
    },

    setupFade: function(fade, index){
        var svg = this.svgs[index];
        if(fade){
            svg.style.transition = fade + 's opacity';
            svg.style.webkitTransition = fade + 's opacity';
        }else{
            svg.style.transition = null;
        }
    },

    show: function(options){
        this.visible = true;
        this.clear();
        var _duration = options && options.hasOwnProperty('duration') ? options.duration : this.duration;
        var _delay = options && options.hasOwnProperty('delay') ? options.delay : this.delay;
        var _fade = options && options.hasOwnProperty('fade') ? options.fade : this.fade;
        var _easing = options && options.hasOwnProperty('easing') ? options.easing : this.easing;
        var _individualDelays = options && options.hasOwnProperty('individualDelays') ? options.individualDelays : this.individualDelays;
        var tempDelay = 0;
        var lastDelay = 0;
        var lastDuration = typeof _duration === 'number' ? _duration : _duration[0];
        var lastFade = typeof _fade === 'number' ? _fade : _fade[0];
        var lastEasing = typeof _easing === 'function' ? _easing : _easing[0];
        var self = this;
        var weight, rounded;
        if(self.renderAlphabet){
            weight = typeof self.weight === 'number' ? self.weight : self.weight[0];
            rounded = typeof self.rounded === 'boolean' ? self.rounded : self.rounded[0];
        }
        var length = this.letters.length;
        this.letters.forEach(function(element, index){
            lastDuration = typeof _duration[index] === 'number' ? _duration[index] : lastDuration;
            lastFade = typeof _fade[index] === 'number' ? _fade[index] : lastFade;
            lastEasing = typeof _easing[index] === 'function' ? _easing[index] : lastEasing;
            if(typeof _delay === 'number'){
                tempDelay = _individualDelays ? _delay : tempDelay + _delay;
            }else{
                lastDelay = typeof _delay[index] === 'number' ? _delay[index] : lastDelay;
                tempDelay = _individualDelays ? lastDelay : tempDelay + lastDelay;
            }
            if(tempDelay){
                self.timer[index] = setTimeout(function(){
                    self.setupFade(lastFade, index);
                    self.svgs[index].style.opacity = 1;
                    self.el.offsetHeight;
                }, 1000 * tempDelay);
            }else{
                self.setupFade(lastFade, index);
                self.svgs[index].style.opacity = 1;
                self.el.offsetHeight;
            }
            if(self.renderAlphabet){
                weight = typeof self.weight[index] === 'number' ? self.weight[index] : weight;
                rounded = typeof self.rounded[index] === 'boolean' ? self.rounded[index] : rounded;
                self.initAlphabet(weight, rounded);
            }
            var _callback = index === length - 1 && options && options.hasOwnProperty('callback') ? options.callback : null;
            var finals = self.alphabet[element].final;
            var segments = self.segments[index];
            segments.forEach(function(element, index){
                element.draw(finals[index].begin, finals[index].end, lastDuration, {delay: tempDelay, circular: true, easing: lastEasing, callback: _callback});
                _callback = null;
            });
        });
    },

    hide: function(options){
        this.visible = false;
        this.clear();
        var _duration = options && options.hasOwnProperty('duration') ? options.duration : this.duration;
        var _delay = options && options.hasOwnProperty('delay') ? options.delay : this.delay;
        var _fade = options && options.hasOwnProperty('fade') ? options.fade : this.fade;
        var _easing = options && options.hasOwnProperty('easing') ? options.easing : this.easing;
        var _individualDelays = options && options.hasOwnProperty('individualDelays') ? options.individualDelays : this.individualDelays;
        var tempDelay = 0;
        var lastDelay = 0;
        var lastDuration = typeof _duration === 'number' ? _duration : _duration[0];
        var lastFade = typeof _fade === 'number' ? _fade : _fade[0];
        var lastEasing = typeof _easing === 'function' ? _easing : _easing[0];
        var self = this;
        var length = this.letters.length;
        this.letters.forEach(function(element, index){
            lastDuration = typeof _duration[index] === 'number' ? _duration[index] : lastDuration;
            lastFade = typeof _fade[index] === 'number' ? _fade[index] : lastFade;
            lastEasing = typeof _easing[index] === 'function' ? _easing[index] : lastEasing;
            if(typeof _delay === 'number'){
                tempDelay = _individualDelays ? _delay : tempDelay + _delay;
            }else{
                lastDelay = typeof _delay[index] === 'number' ? _delay[index] : lastDelay;
                tempDelay = _individualDelays ? lastDelay : tempDelay + lastDelay;
            }
            self.setupFade(lastFade, index);
            var time = 1000 * (lastDuration - lastFade + tempDelay);
            if(time){
                self.timer[index] = setTimeout(function(){
                    self.svgs[index].style.opacity = 0;
                    self.el.offsetHeight;
                }, time);
            }else{
                self.svgs[index].style.opacity = 0;
                self.el.offsetHeight;
            }
            var _callback = index === length - 1 && options && options.hasOwnProperty('callback') ? options.callback : null;
            var initial = self.alphabet[element].initial;
            var segments = self.segments[index];
            segments.forEach(function(element, index){
                element.draw(initial[index].begin, initial[index].end, lastDuration, {delay: tempDelay, circular: true, easing: lastEasing, callback: _callback});
                _callback = null;
            });
        });
    },

    toggle: function(options){
        if(this.visible){
            this.hide(options);
        }else{
            this.show(options);
        }
    },

    showInstantly: function(){
        this.show({duration: 0, delay: 0, fade: 0});
    },

    hideInstantly: function(){
        this.hide({duration: 0, delay: 0, fade: 0});
    },

    toggleInstantly: function(){
        this.toggle({duration: 0, delay: 0, fade: 0});
    },

    clear: function(){
        var self = this;
        this.letters.forEach(function(element, index){
            clearTimeout(self.timer[index]);
        });
    },

    initAlphabet: function(weight, rounded){
        var width = 44 + weight;
        var height = 94 + (2 * weight);
        var radius = 20;
        var _weight = rounded ? 0 : weight / 2;
        var circle = 'm 0 -'+ radius +' a '+ radius +' '+ radius +' 0 1 1 0 '+ (2 * radius) +' a '+ radius +' '+ radius +' 0 1 1 0 -'+ (2 * radius);
        var circleCenter = 'm '+ (width / 2) +' '+ (height / 2) +' ' + circle;
        var circleLeft = 'm '+ (width / 2) +' '+ (height / 2) +' ' + circle;
        var circleRight = 'm '+ ((width / 2) + (2 * radius)) +' '+ (height / 2) +' ' + circle;
        var circleF = 'm '+ (width / 2) +' '+ ((height / 2) - 12) +' ' + circle;
        var circleF2 = 'm '+ (width / 2) +' '+ ((height / 2) + (weight / 2)) +' ' + circle;
        var circleGY = 'm '+ (width / 2) +' '+ ((height / 2) + radius + _weight) +' ' + circle;
        var circleJ = 'm '+ ((width / 2) - radius - _weight) +' '+ ((height / 2) + radius + _weight) +' ' + circle;
        var circleSXZ = 'm '+ ((width / 2) - radius - _weight) +' '+ (height / 2) +' ' + circle;
        var circleSXZ2 = 'm '+ ((width / 2) + radius - _weight) +' '+ (height / 2) +' ' + circle;
        var lineLeft = 'm '+ ((width / 2) - radius) +' 0 l 0 '+ height;
        var lineLeftLarge = 'm '+ ((width / 2) - radius) +' 0 l 0 '+ height;
        var lineRight = 'm '+ ((width / 2) + radius) +' 0 l 0 '+ height;
        var lineRightLarge = 'm '+ ((width / 2) + (3 * radius)) +' 0 l 0 '+ height;
        var lineCenter = 'm '+ ((width / 2) - radius) +' 0 l 0 '+ height;
        var lineE = 'm 0 '+ ((height / 2) + _weight + (_weight ? 0 : 1)) +' l '+ width +' 0';
        var lineJ = 'm '+ ((width / 2) - _weight) +' 0 l 0 '+ height;
        var lineT = 'm 0 '+ ((height / 2) - radius) +' l '+ width +' 0';
        var svgSmall = {width: width, height: height};
        var svgLarge = {width: (width + (2 * radius)), height: height};
        var svgFJRT = {width: (width - radius - _weight), height: height};
        var svgSXZ = {width: (width - (2 * _weight)), height: height};
        var p50plus23 = '50% + ' + (radius + _weight);
        var p50minus23 = '50% - ' + (radius + _weight);
        var p50minus20 = '50% - ' + radius;
        var p50minus35 = '50% - ' + (radius + _weight + 12);
        this.alphabet = {
            'a': {
                svg: svgSmall,
                paths: [circleCenter, lineRight],
                initial: [{begin: '5%', end: '5%'}, {begin: '90%', end: '90%'}],
                final: [{begin: '50%', end: '125% + 1'}, {begin: '50%', end: p50plus23}]
            },
            'b': {
                svg: svgSmall,
                paths: [circleCenter, lineLeft],
                initial: [{begin: '-125%', end: '-125%'}, {begin: '5%', end: '5%'}],
                final: [{begin: '-125%', end: '-50%'}, {begin: p50minus35, end: p50plus23}]
            },
            'c': {
                svg: svgSmall,
                paths: [circleCenter],
                initial: [{begin: '105%', end: '105%'}],
                final: [{begin: '-50%', end: '25%'}]
            },
            'd': {
                svg: svgSmall,
                paths: [circleCenter, lineRight],
                initial: [{begin: '125%', end: '125%'}, {begin: '5%', end: '5%'}],
                final: [{begin: '50%', end: '125%'}, {begin: p50minus35, end: p50plus23}]
            },
            'e': {
                svg: svgSmall,
                paths: [circleCenter, lineE],
                initial: [{begin: '-105%', end: '-105%'}, {begin: '5%', end: '5%'}],
                final: [{begin: '50%', end: '125% + 1'}, {begin: '50%', end: p50plus23}]
            },
            'f': {
                svg: svgFJRT,
                paths: [circleF, circleF2, lineLeft],
                initial: [{begin: '-25%', end: '-25%'}, {begin: '1', end: '1'}, {begin: '50% - 13', end: '50% - 13'}],
                final: [{begin: '-25%', end: '1'}, {begin: '-25%', end: '1'}, {begin: '50% - 13', end: p50plus23}]
            },
            'g': {
                svg: svgSmall,
                paths: [circleCenter, circleGY, lineRight],
                initial: [{begin: '25%', end: '25%'}, {begin: '-10%', end: '-10%'}, {begin: '50%', end: '50%'}],
                final: [{begin: '-50%', end: '25% + 1'}, {begin: '-75% - 1', end: '-50%'}, {begin: '50%', end: p50plus23}]
            },
            'h': {
                svg: svgSmall,
                paths: [circleCenter, lineLeft, lineRight],
                initial: [{begin: '-25%', end: '-25%'}, {begin: '10%', end: '10%'}, {begin: '90%', end: '90%'}],
                final: [{begin: '-150%', end: '-75% + 1'}, {begin: p50minus35, end: '50%'}, {begin: '50%', end: p50plus23}]
            },
            'i': {
                svg: {width: (width - (2 * radius)), height: height},
                paths: [lineCenter],
                initial: [{begin: '50%', end: '50%'}],
                final: [{begin: p50minus23, end: p50plus23}]
            },
            'j': {
                svg: svgFJRT,
                paths: [circleJ, lineJ],
                initial: [{begin: '5%', end: '5%'}, {begin: p50minus23, end: p50minus23}],
                final: [{begin: '25% - 1', end: '50%'}, {begin: p50minus23, end: p50plus23}]
            },
            'k': {
                svg: svgSmall,
                paths: [circleCenter, lineLeft],
                initial: [{begin: '50%', end: '50%'}, {begin: '80%', end: '80%'}],
                final: [{begin: '25%', end: '100%'}, {begin: p50minus35, end: p50plus23}]
            },
            'l': {
                svg: {width: (width - (2 * radius)), height: height},
                paths: [lineCenter],
                initial: [{begin: '50%', end: '50%'}],
                final: [{begin: p50minus35, end: p50plus23}]
            },
            'm': {
                svg: svgLarge,
                paths: [circleLeft, circleRight, lineLeftLarge],
                initial: [{begin: '90%', end: '90%'}, {begin: '90%', end: '90%'}, {begin: '90%', end: '90%'}],
                final: [{begin: '-25%', end: '50%'}, {begin: '-25%', end: '50%'}, {begin: p50minus23, end: p50plus23}]
            },
            'n': {
                svg: svgSmall,
                paths: [circleCenter, lineLeft],
                initial: [{begin: '-60%', end: '-60%'}, {begin: '90%', end: '90%'}],
                final: [{begin: '-25%', end: '50%'}, {begin: p50minus23, end: p50plus23}]
            },
            'o': {
                svg: svgSmall,
                paths: [circleCenter],
                initial: [{begin: '-150%', end: '-150%'}],
                final: [{begin: '2%', end: '98%'}]
            },
            'p': {
                svg: svgSmall,
                paths: [circleCenter, lineLeft],
                initial: [{begin: '25%', end: '25%'}, {begin: p50plus23, end: p50plus23}],
                final: [{begin: '-25% - 1', end: '50%'}, {begin: '50%', end: '50% + 46'}]
            },
            'q': {
                svg: svgSmall,
                paths: [circleCenter, lineRight],
                initial: [{begin: '-25%', end: '-25%'}, {begin: p50plus23, end: p50plus23}],
                final: [{begin: '-50%', end: '25% + 1'}, {begin: '50%', end: '50% + 46'}]
            },
            'r': {
                svg: svgFJRT,
                paths: [circleCenter, lineLeft],
                initial: [{begin: '-25% - 1', end: '-25% - 1'}, {begin: '50%', end: '50%'}],
                final: [{begin: '-25% - 1', end: '1'}, {begin: '50%', end: p50plus23}]
            },
            's': {
                svg: svgSXZ,
                paths: [circleSXZ, circleSXZ2],
                initial: [{begin: '50%', end: '50%'}, {begin: '1', end: '1'}],
                final: [{begin: '25%', end: '50%'}, {begin: '-25% - 1', end: '1'}]
            },
            't': {
                svg: svgFJRT,
                paths: [circleCenter, lineLeft, lineT],
                initial: [{begin: '50%', end: '50%'}, {begin: '5%', end: '5%'}, {begin: '50%', end: '50%'}],
                final: [{begin: '50%', end: '75% + 1'}, {begin: p50minus35, end: '50%'}, {begin: p50minus20, end: '50%'}]
            },
            'u': {
                svg: svgSmall,
                paths: [circleCenter, lineRight],
                initial: [{begin: '50%', end: '50%'}, {begin: '80%', end: '80%'}],
                final: [{begin: '25%', end: '100%'}, {begin: p50minus23, end: p50plus23}]
            },
            'v': {
                svg: svgSmall,
                paths: [circleCenter, lineRight],
                initial: [{begin: '10%', end: '10%'}, {begin: '20%', end: '20%'}],
                final: [{begin: '25% - 1', end: '100%'}, {begin: p50minus23, end: '50%'}]
            },
            'w': {
                svg: svgLarge,
                paths: [circleLeft, circleRight, lineRightLarge],
                initial: [{begin: '10%', end: '10%'}, {begin: '10%', end: '10%'}, {begin: '20%', end: '20%'}],
                final: [{begin: '25%', end: '100%'}, {begin: '25% - 1', end: '100%'}, {begin: p50minus23, end: '50%'}]
            },
            'x': {
                svg: svgSXZ,
                paths: [circleSXZ, circleSXZ2],
                initial: [{begin: '50%', end: '50%'}, {begin: '1', end: '1'}],
                final: [{begin: '0', end: '50%'}, {begin: '-50%', end: '1'}]
            },
            'y': {
                svg: svgSmall,
                paths: [circleCenter, circleGY, lineRight],
                initial: [{begin: '1', end: '1'}, {begin: '1', end: '1'}, {begin: p50minus23, end: p50minus23}],
                final: [{begin: '-75%', end: '1'}, {begin: '25% - 1', end: '50%'}, {begin: p50minus23, end: p50plus23}]
            },
            'z': {
                svg: svgSXZ,
                paths: [circleSXZ, circleSXZ2],
                initial: [{begin: '25%', end: '25%'}, {begin: '75%', end: '75%'}],
                final: [{begin: '0', end: '25% + 1'}, {begin: '50%', end: '75%'}]
            },
            ' ': {
                svg: svgSmall
            }
        };
    }
};