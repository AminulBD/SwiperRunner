/*!
 * Swiper Runner
 * Easy way to use Swiper.js
 *
 * @version 1.0.0
 * @link https://github.com/AminulBD/swiperRunner
 * @license MIT
 *
 * Copyright 2017, Aminul Islam
 */
(function($) {

	'use strict';

	var SwiperRunner = function(selector) {

		var sr = this,
			main,
			nav;

		/**
		 * Preview The Next and Prev slides on navigations
		 * @param  {object} swiper   pass the swiper instance
		 * @param  {object} settings pass the swiper settings object
		 */
		var navPreview = function(swiper, settings) {
			var activeIndex = swiper.activeIndex,
				limit = settings.navPreviewItems,
				slidesCount	= swiper.slides.not(".swiper-slide-duplicate").length;

			if (slidesCount < limit || ! swiper.prevButton || ! swiper.nextButton)
				return false;

			if (activeIndex === slidesCount + 1) {
				activeIndex = 1;
			} else if (activeIndex === 0) {
				activeIndex = slidesCount;
			}
			var prevThumbs = '';
			var nextThumbs = '';
			for (var i = -limit; i < limit + 1; i++) {
				if (i === 0)
					continue;

				if ( i < 0 ) {
					if ((activeIndex + i - 1) < 0) {
						prevThumbs += '<span class="swiper-nav-preview' + i + '"><img src="' + swiper.slides[slidesCount + i + 1].getAttribute('data-thumb') + '"></span>';
					} else {
						prevThumbs += '<span class="swiper-nav-preview' + i + '"><img src="' + swiper.slides[activeIndex + i].getAttribute('data-thumb') + '"></span>';
					}
				} else {
					if (activeIndex + i - 1 > slidesCount) {
						nextThumbs += '<span class="swiper-nav-preview-' + i + '"><img src="' + swiper.slides[i].getAttribute('data-thumb') + '"></span>';
					} else {
						nextThumbs += '<span class="swiper-nav-preview-' + i + '"><img src="' + swiper.slides[activeIndex + i].getAttribute('data-thumb') + '"></span>';
					}
				}
			}
			swiper.prevButton.html(prevThumbs);
			swiper.nextButton.html(nextThumbs);
		}

		/**
		 * Make animated layers with animate.css
		 * @param  {object} swiper need to pass the swiper instance.
		 * @return {[type]}        [description]
		 */
		var animatedLayers = function(swiper) {

			var $current = $(swiper.slides[swiper.activeIndex]);

			$('[data-animate]', $current).each(function(i) {
				var $this = $(this),
					animation = $this.data('animate'),
					delayData = $this.data('delay'),
					duration = $this.data('duration'),
					speed = swiper.params.speed + 'ms',
					indexVal = Number( '0.' + i ) * 2,
					delay = delayData ? delayData : (0.2 + indexVal) + 's';

				$this.css({
					"visibility": "visible",
					"-webkit-animation-delay": delay,
					"animation-delay": delay,
					"-webkit-animation-duration": duration,
					"animation-duration": duration
				})
				.addClass(animation + ' animated')
				.one('webkitAnimationEnd animationend', function() {
					$this.removeClass(animation + ' animated');
				});
			})
		};

		/**
		 * Remove Animation Classes
		 * @param  {object} swiper need to pass the swiper instance.
		 */
		
		var removeAnimations = function(swiper) {
			var $layers = swiper.container.find('[data-animate]');

			$layers.each(function() {
				var $this = $(this),
					animation = $this.data('animate');

				$this.removeClass(animation + ' animated');
				$this.css('visibility', 'hidden');
			});
		};

		/**
		 * Make swiper instance
		 * @param  {string} selector need to pass a CSS selector.
		 * @param  {Boolean} nav      if you want set the navigation variable.
		 */
		var swiper = function(selector, nav) {

			var $carousel 	= $(selector),
				$config 	= $carousel.data('swiper-config'),
				$pagination = $('.swiper-pagination', $carousel),
				$navPrev 	= $('.swiper-button-prev', $carousel),
				$navNext 	= $('.swiper-button-next', $carousel),
				$scrollbar 	= $('.swiper-scrollbar', $carousel),
				$playBtn 	= $('.swiper-play', $carousel),
				$pauseBtn 	= $('.swiper-pause', $carousel);

			// Set Defaults
			var settings = {
				nextButton: ($navNext.length) ? $navNext : null,
				prevButton: ($navPrev.length) ? $navPrev : null,
				scrollbar: ($scrollbar.length) ? $scrollbar : null,
				navPreview: false,
				navPreviewItems: 3,
				animatedLayers: true
			};

			// Merge Objects
			$.extend(true, settings, $config );

			// Render the pagination
			if ($pagination.length) {
				settings.pagination = $pagination;

				// Friction Pagination
				if ('fraction' === settings.paginationType) {
					var $fracText = ($pagination.data('text')) ? $pagination.data('text') : '/';
					settings.paginationFractionRender = function(swiper, currentClassName, totalClassName) {
						return '<span class="' + currentClassName + '"></span>' +
						'<span>' + $fracText + '</span>' +
						'<span class="' + totalClassName + '"></span>';
					};
				}
			}

			// On Init
			settings.onInit = function(swiper) {
				// Nav Preview
				if (settings.navPreview) {
					navPreview(swiper, settings);
				}

				// Playing Control
				if ( swiper.autoplaying ) {
					$playBtn.removeClass('active');
					$pauseBtn.addClass('active');
				}
			}

			// On Slide Change Start
			settings.onSlideChangeStart = function(swiper) {

				// Playing Control
				if ( false === swiper.autoplaying ) {
					$playBtn.addClass('active');
					$pauseBtn.removeClass('active');
				}

				// Navigation Slide Preview
				if (settings.navPreview) {
					navPreview(swiper, settings);
				}

				// Remove Animations
				if ( settings.animatedLayers ) {
					removeAnimations(swiper);
				}
				
			};

			// On Slide Change End
			settings.onSlideChangeEnd = function(swiper) {
				// Make Animated
				if ( settings.animatedLayers ) {
					animatedLayers(swiper);
				}
			}


			// Let's Kick
			var instance = new Swiper($carousel, settings);

			// Control Autoplay
			if (settings.autoplay) {
				$pauseBtn.addClass('active');
			} else {
				$playBtn.addClass('active');
			}

			// Play Button
			$playBtn.on('click', function(e) {
				instance.params.autoplay = (settings.autoplay) ? settings.autoplay : 5000;
				instance.startAutoplay();

				$playBtn.toggleClass('active');
				$pauseBtn.toggleClass('active');
				e.preventDefault();
			});

			// Pause Button
			$pauseBtn.on('click', function(e) {
				instance.stopAutoplay();

				$playBtn.toggleClass('active');
				$pauseBtn.toggleClass('active');
				e.preventDefault();
			});

			// Set globals for more customizations
			if ( nav ) {
				sr.nav = instance;
			} else {
				sr.main = instance;
			}
		};

		/**
		 * Set another carousel as navigation
		 * @param {strong || object} navSelector pass the css selector.
		 */
		sr.setNav = function(navSelector) {
			swiper(navSelector, true);
			sr.main.params.control = sr.nav;
			sr.nav.params.control = sr.main;
		};

		var init = function() {
			swiper(selector);
		};

		init();

		return sr;

	}

	window.SwiperRunner = SwiperRunner;
})(jQuery);