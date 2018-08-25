/*
 * jTinder v.1.0.0
 * https://github.com/do-web/jTinder
 * Requires jQuery 1.7+, jQuery transform2d
 *
 * Copyright (c) 2014, Dominik Weber
 * Licensed under GPL Version 2.
 * https://github.com/do-web/jTinder/blob/master/LICENSE
 */
;(function ($, window, document, undefined) {
	var pluginName = "jTinder",
		defaults = {
			onDislike: null,
			onLike: null,
			animationRevertSpeed: 200,
			animationSpeed: 400,
			threshold: 1,
			likeSelector: '.like',
			dislikeSelector: '.dislike',
			rotationRatio: 8,			
		};

    var tinderslide = null;
	var container = null;
	var panes = null;
	var $that = null;
	var xStart = 0;
	var yStart = 0;
	var paneYStart = 0;
	var touchStart = false;
	var posX = 0, posY = 0, lastPosX = 0, lastPosY = 0, pane_width = 0, pane_count = 0, current_pane = -1;

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(element);
	}

	Plugin.prototype = {



        init: function (element) {
            $that = this;
            tinderslide = element;

            $that.startOver();

            $(element).bind('touchstart mousedown', this.handler);
            $(element).bind('touchmove mousemove', this.handler);
            $(element).bind('touchend mouseup', this.handler);
        },

        startOver: function () {
            //var old_pane_count = pane_count;
            var offset_from_top = pane_count - current_pane;
            container = $(">ul", tinderslide);
            panes = $(">ul>li", tinderslide);
            pane_width = container.width();
            pane_count = panes.length;
            current_pane = panes.length - 1;//offset_from_top;

        },

		showPane: function (index) {
			panes.eq(current_pane).hide();
			current_pane = index;
		},

		next: function () {
			// Call to onBeforeNext if available, passing the current
			// index as an argument
			$that.settings.onBeforeNext
				&& $that.settings.onBeforeNext(panes.eq(current_pane));

			//@link https://github.com/Stemlet/jTinder/commit/f3565b6f2376ebaf013306829b2b3fcfa5f4c938
			// PR#1: Call to onFinish if available, no arguments passed
			// PR#7: Add passing "this" to be able to call rewind on the instance.
			!current_pane && $that.settings.onFinish && $that.settings.onFinish(this);
			var showResult = this.showPane(current_pane - 1);

			// Call to onAfterNext if available, passing the current
			// index as an argument
			$that.settings.onAfterNext
				&& $that.settings.onAfterNext(panes.eq(current_pane));
			return showResult;
		},

		/**
		 * jTinder.rewind() function for looping feature.
		 * The rewind method removes the CSS transformations from the panels
		 * and shows them again. Additionally it rewinds the current_pane
		 * index of the jTinder instance.
		 * @author: Grégory Saive <greg@evias.be> (http://github.com/evias)
		 **/
		rewind: function() {
			$.each(panes, function(index, panel)
			{
				var jqElm = $(panel);
				jqElm.css("transform", "");
				jqElm.show();
				current_pane = index+1;
			});
		},

		dislike: function() {
			panes.eq(current_pane).animate({"transform": "translate(-" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
				if($that.settings.onDislike) {
					$that.settings.onDislike(panes.eq(current_pane));
				}
				$that.next();
			});
		},

		like: function() {
			panes.eq(current_pane).animate({"transform": "translate(" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(60deg)"}, $that.settings.animationSpeed, function () {
				if($that.settings.onLike) {
					$that.settings.onLike(panes.eq(current_pane));
				}
				$that.next();
			});
		},

		handler: function (ev) {
			ev.preventDefault();

			switch (ev.type) {
				case 'touchstart':
					if(touchStart === false) {
						touchStart = true;
						xStart = ev.originalEvent.touches[0].pageX;
						yStart = ev.originalEvent.touches[0].pageY;
						paneYStart = $(panes.eq(current_pane)).position().top;
					}
				case 'mousedown':
					if(touchStart === false) {
						touchStart = true;
						xStart = ev.pageX;
						yStart = ev.pageY;
						paneYStart = $(panes.eq(current_pane)).position().top;				
					}
				case 'mousemove':
				case 'touchmove':
					if(touchStart === true) {
						var pageX = typeof ev.pageX == 'undefined' ? ev.originalEvent.touches[0].pageX : ev.pageX;
						var pageY = typeof ev.pageY == 'undefined' ? ev.originalEvent.touches[0].pageY : ev.pageY;
						var deltaX = parseInt(pageX) - parseInt(xStart);
						var deltaY = parseInt(pageY) - parseInt(yStart);
						var percent = ((100 / pane_width) * deltaX) / $that.settings.rotationRatio;
						posX = deltaX + lastPosX;
						posY = deltaY + lastPosY;

						current_pane_elem = panes.eq(current_pane);
						current_pane_elem.css("transform", "translate(" + posX + "px," + posY + "px) rotate(" + (percent / 2) + "deg)");

						var opa = (Math.abs(deltaX) / $that.settings.threshold) / 100 + 0.2;
						if(opa > 1.0) {
							opa = 1.0;
						}
						if (posX >= 0) {
							current_pane_elem.find($that.settings.likeSelector).css('opacity', opa);
							current_pane_elem.find($that.settings.dislikeSelector).css('opacity', 0);
						} else if (posX < 0) {

							current_pane_elem.find($that.settings.dislikeSelector).css('opacity', opa);
							current_pane_elem.find($that.settings.likeSelector).css('opacity', 0);
						}
					}
					break;
				case 'mouseup':
				case 'touchend':
					touchStart = false;
					var pageX = (typeof ev.pageX == 'undefined') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
					var pageY = (typeof ev.pageY == 'undefined') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY;
					var deltaX = parseInt(pageX) - parseInt(xStart);
					var deltaY = parseInt(pageY) - parseInt(yStart);

					posX = deltaX + lastPosX;
					posY = deltaY + lastPosY;
					var opa = Math.abs((Math.abs(deltaX) / $that.settings.threshold) / 100 + 0.2);

					current_pane_elem = panes.eq(current_pane);
					if (opa >= 1) {
						if (posX > 0) {
							current_pane_elem.animate({"transform": "translate(" + (pane_width) + "px," + (posY + pane_width) + "px) rotate(60deg)"}, $that.settings.animationSpeed, function () {
								if($that.settings.onLike) {
									$that.settings.onLike(current_pane_elem);
								}
								$that.next();
							});
						} else {
							current_pane_elem.animate({"transform": "translate(-" + (pane_width) + "px," + (posY + pane_width) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
								if($that.settings.onDislike) {
									$that.settings.onDislike(current_pane_elem);
								}
								$that.next();
							});
						}
					} else {
						lastPosX = 0;
						lastPosY = 0;

						current_pane_elem = panes.eq(current_pane);
						current_pane_elem.animate({"transform": "translate(0px,"+paneYStart+"px) rotate(0deg)"}, $that.settings.animationRevertSpeed);
						current_pane_elem.find($that.settings.likeSelector).animate({"opacity": 0}, $that.settings.animationRevertSpeed);
						current_pane_elem.find($that.settings.dislikeSelector).animate({"opacity": 0}, $that.settings.animationRevertSpeed);
						paneYStart = 0

					}
					break;
			}
		}
	};

	$.fn[ pluginName ] = function (options) {
		this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
			else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, 'plugin_' + pluginName)[options]();
			}
		});

		return this;
	};

})(jQuery, window, document);