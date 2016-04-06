(function() {

	/**
	 * checks if a number is Odd
	 */
	function isOdd(n) {
		return Math.abs(n % 2) == 1;
	}

	/**
	 * returns a random number between min and max
	 */
	function randomIntFromInterval(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}

	// plugin options for each word
	var options = [
		{ 	// word 1
			size : 190,
			weight : 1,
			color: '#f8f8f8',
			duration: 0.5,
			fade: 0,
			delay: 0,
			easing: d3_ease.easeSinInOut.ease
		},
		{ 	// word 2
			size : 210,
			weight : 8,
			color: '#f5f5f5',
			duration: 0.7,
			fade: 0.7,
			delay: 0.05,
			easing: d3_ease.easeSinInOut.ease
		},
		{ 	// word 3
			size : 330,
			weight : 12,
			color: '#151517',
			duration: 0.4,
			fade: 0,
			delay: 0.2,
			easing: d3_ease.easePolyOut.ease
		},
		{ 	// word 4
			size : 300,
			weight : 35,
			color: ['#3B3E3B','#DC6A28','#8BC34A','#4585B7','#E24444'],
			duration: 1,
			fade: 1,
			delay: [0.4,0.3,0.2,0.1,0],
			individualDelays: true,
			easing: d3_ease.easeCubicOut.ease
		},
		{ 	// word 5
			size : 200,
			weight : 24,
			color: '#1E1D23',
			duration: 1,
			delay: [0.1,0.4,0.2,0.45,0.15,0.35,0.1,0.2],
			fade: 0,
			individualDelays: true,
			easing: d3_ease.easeBounceOut.ease
		},
		{ 	// word 6
			size : [300,180],
			weight : [18,8],
			color: ['#2F3DAB','#f1f1f1'],
			duration: [1.3,0.6,0.5,0.8,0.6,0.9],
			delay: 0.15,
			fade: 0,
			easing: [d3_ease.easeExpOut.ease,d3_ease.easePolyOut.ease]
		},
		{ 	// word 7
			size : 300,
			weight : [28,2],
			color: '#2C2B50',
			duration: 0.35,
			delay: [0,0.1,0.2,0.3,0.4,0.5],
			fade: 0.35,
			individualDelays: true,
			easing: d3_ease.easePolyOut.ease
		},
		{ 	// word 8
			size : 300,
			weight : 20,
			rounded: true,
			color: '#f0f0f0',
			duration: 1,
			delay: 0,
			easing: d3_ease.easePolyOut.ease
		},
		{ 	// word 9
			size : [400,300,200,100],
			weight : [28,23,18,13],
			color: '#41424C',
			duration: [1.1,1.2,1.3,1.4],
			delay: 0.05,
			fade: 1.5,
			easing: d3_ease.easeExpInOut.ease
		},
		{ 	// word 10
			size : 400,
			weight : 25,
			color: '#f0f0f0',
			duration: 1.5,
			delay: 0.1,
			easing: d3_ease.easeBounceOut.ease
		},
		{ 	// word 11
			size : 390,
			weight : 10,
			color: '#E65454',
			duration: 0.8,
			fade: 2,
			delay: 0.1,
			easing: d3_ease.easeExpInOut.ease
		},
		{ 	// word 12
			size : 500,
			weight : 25,
			color: '#3F51B5',
			duration: 1,
			fade: 1.5,
			delay: 0.2,
			easing: d3_ease.easeExpInOut.ease
		}
	],
	// items (li)
	items = [].slice.call(document.querySelectorAll('ul.list > li.list__item'));

	function init() {
		
		items.forEach(function(item, pos) {
			var word = item.querySelector('.list__text'),
				playCtrl = item.querySelector('.control__button--play'),
				// initialize the plugin
				instance = new Letters(word, options[pos]),
				endPlayCallback = function() {
					playCtrl.className = 'control__button control__button--play';
					word.setAttribute('data-state', 'stop');
				};
			
			// show word
			instance.showInstantly();

			// moo.js configurations for some of the buttons
			var timelines = {};
			var letters = [].slice.call(word.querySelectorAll('svg')),
				lettersTotal = letters.length,
				distanceFactor = 40;

			timelines[pos+1] = new mojs.Timeline();

			letters.forEach(function(letter, i) {
				var ty = -1 * distanceFactor * (lettersTotal - i);
				tween = new mojs.Tween({
					duration : 2000,
					delay: 50 + 50*i,
					easing: mojs.easing.elastic.out,
					onUpdate: function(progress) {
						letter.style.WebkitTransform = letter.style.transform = 'translate3d(0,' + ty * (1-progress) + '%,0)';
					}
				});

				timelines[pos+1].add(tween);
			});
			if ( pos === 7 ) {
				var letters = [].slice.call(word.querySelectorAll('svg')),
					lettersTotal = letters.length,
					distanceFactor = 80,
					halfLen = lettersTotal/2;

				timelines[pos+1] = new mojs.Timeline();

				letters.forEach(function(letter, i) {
					var tx = isOdd(lettersTotal) ? -1 * (Math.floor(halfLen) - i) * distanceFactor : -1 * (halfLen - i) * distanceFactor + distanceFactor/2,
						tween = new mojs.Tween({
							duration : 2000,
							easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
							onUpdate: function(progress) {
								letter.style.WebkitTransform = letter.style.transform = 'translate3d(' + tx * (1-progress) + '%,0,0) scale3d(' + progress + ',' + progress + ',1)';
							}
						});

					timelines[pos+1].add(tween);
				});
			}
			else if ( pos === 8 ) {
				var letters = [].slice.call(word.querySelectorAll('svg')),
					lettersTotal = letters.length,
					distanceFactor = 40;

				timelines[pos+1] = new mojs.Timeline();

				letters.forEach(function(letter, i) {
					var ty = -1 * distanceFactor * (lettersTotal - i)
						tween = new mojs.Tween({
							duration : 2000,
							delay: 50 + 50*i,
							easing: mojs.easing.elastic.out,
							onUpdate: function(progress) {
								letter.style.WebkitTransform = letter.style.transform = 'translate3d(0,' + ty * (1-progress) + '%,0)';
							}
						});

					timelines[pos+1].add(tween);
				});
			}
			else if ( pos === 9 ) {
				var letters = [].slice.call(word.querySelectorAll('svg')),
					distanceFactor = 60;
				timelines[pos+1] = new mojs.Timeline();

				letters.forEach(function(letter, i) {
					var tween = new mojs.Tween({
							duration : 1500,
							delay: 100 + 100*i,
							easing: mojs.easing.bounce.out,
							onUpdate: function(progress) {
								letter.style.WebkitTransform = letter.style.transform = 'translate3d(0,' + distanceFactor * (1-progress) + '%,0)';
							}
						});

					timelines[pos+1].add(tween);
				});
			}
			else if( pos === 10 ) {
				var letters = [].slice.call(word.querySelectorAll('svg')),
					wordRect = word.getBoundingClientRect(),
					wordWidth = wordRect.width,
					wordHeight = wordRect.height,
					letterOffsetPosition = 0;

				timelines[pos+1] = new mojs.Timeline();

				letters.forEach(function(letter, i) {
					var letterRect = letter.getBoundingClientRect(),
						letterWidth = letterRect.width,
						letterHeight = letterRect.height,
						letterWidthPercentage = letterWidth*100/wordWidth;

					letterOffsetPosition += letterWidthPercentage;

					var burst = new mojs.Burst({
						parent: word,
						duration: 1000,
						delay: 600 + 115*i,
						shape : 'circle',
						fill : '#E65454',
						x: letterOffsetPosition + '%',
						y: randomIntFromInterval(20, 80) + '%',
						childOptions: {
							radius: {'rand(90,20)':0}
						},
						radius: {50:160},
						opacity: 0.3,
						count: randomIntFromInterval(5,20),
						isSwirl: true,
						isRunLess: true,
						easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
					});

					timelines[pos+1].add(burst);
				});
			}
			else if( pos === 11 ) {
				var letters = [].slice.call(word.querySelectorAll('svg')),
					wordRect = word.getBoundingClientRect(),
					wordWidth = wordRect.width,
					letterOffsetPosition = 0;

				timelines[pos+1] = new mojs.Timeline();

				letters.forEach(function(letter, i) {
					var letterRect = letter.getBoundingClientRect(),
						letterWidth = letterRect.width,
						letterHeight = letterRect.height,
						letterWidthPercentage = letterWidth*100/wordWidth;

					letterOffsetPosition += letterWidthPercentage;

					var ring = new mojs.Transit({
						parent: word,
						duration: 1000,
						delay: 750 + 200*i,
						type: 'circle',
						radius: {0: letterHeight/2},
						fill: 'transparent',
						stroke: '#9091CE',
						strokeWidth: {40:0},
						opacity: 1,
						x: letterOffsetPosition - letterWidthPercentage/2 + '%',
						y: '50%',
						isRunLess: true,
						easing: mojs.easing.bezier(0.2, 1, 0.3, 1)
					})

					timelines[pos+1].add(ring);
				});
			}

			playCtrl.addEventListener('click', function() {
				if( word.getAttribute('data-state') === 'play' ) {
					return false;
				}
				word.setAttribute('data-state', 'play');
				playCtrl.className = 'control__button control__button--play control__button--active';

				if( pos === 6 ) { // showcase how to undraw with an animation
					instance.hide({
						callback: function() {
							setTimeout(function() {
								instance.show({
									duration : 0.35,
									delay : [0,0.1,0.2,0.3,0.4,0.5],
									fade : .35,
									individualDelays : true,
									easing : d3_ease.easePolyOut.ease,
									callback : endPlayCallback
								});
							}, 300);
						}
					});
				}
				// showcase with animations using mo.js lib:
				else if( pos === 7 || pos === 8 || pos === 10 ) {
					instance.hideInstantly();
					timelines[pos+1].start();
					instance.show({callback : endPlayCallback});
				}
				else if( pos === 9 ) {
					instance.hide({
						duration: 0.6, delay: 0.1, easing: d3_ease.easeExpOut.ease,
						callback: function() {
							timelines[pos+1].start();
							instance.show({callback : endPlayCallback});
						}
					});
				}
				else if( pos === 11 ) {
					instance.hide({
						duration: 0.6, delay: 0, fade: 0.6,
						easing: d3_ease.easeExpOut.ease,
						callback: function() {
							timelines[pos+1].start();
							instance.show({callback : endPlayCallback});
						}
					});
				}
				// default behaviour
				else {
					instance.hideInstantly();
					instance.show({callback: endPlayCallback});
				}
			});
		});
	}

	init();

})();
