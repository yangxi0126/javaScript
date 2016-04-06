(function() {

	var items = [].slice.call(document.querySelectorAll('ul.grid > li.grid__item'));

	function init() {
		items.forEach(function(item) {
			var word = item.querySelector('.grid__heading'),
				// initialize the plugin
				instance = new Letters(word, {
					size : 200,
					weight : 10,
					color: '#E65454',
					duration: 0.8,
					delay: 0.1,
					fade: 0,
					easing: d3_ease.easeExpOut.ease
				});

			// show word
			instance.showInstantly();

			item.addEventListener('click', function() {
				instance.hide({
					duration: 1,
					delay: 0,
					fade: 1,
					easing: d3_ease.easeExpOut.ease,
					callback: function() {
						instance.show();
					}
				});
			});
		});
	}

	init();
})();
