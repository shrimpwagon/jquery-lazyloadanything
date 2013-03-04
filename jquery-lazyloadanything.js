/*!
	jQuery LazyLoadAnything - 2013-03-04
	(c) 2013 Shawn Welch http://shrimpwagon.wordpress.com/jquery-lazyloadanything
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function( $ ) {

	// Cache jQuery window
	var $window = $(window);
	
	// Force load flag
	var force_load_flag = false;

	// Plugin methods
	var methods = {
	
		'init': function(options) {
		
			var defaults = {
				'auto': true,
				'cache': false,
				'timeout': 1000,
				'includeMargin': false,
				'repeatLoad': false,
				'onLoadingStart': function(e, llelements, indexes) {
					return true;
				},
				'onLoad': function(e, llelement) {
					return true;
				},
				'onLoadingComplete': function(e, llelements, indexes) {
					return true;
				}
			}

			var settings = $.extend({}, defaults, options);
			var timeout = 0;
			var llelements = [];
			var $selector = this;

			// Scroll listener
			$window.bind('scroll.lla', function(e) {
		
				// Check for manually/auto load
				if(!force_load_flag && !settings.auto) return false;
				force_load_flag = false;
		
				// Clear timeout if scrolling continues
				clearTimeout(timeout);
		
				// Set the timeout for onLoad
				timeout = setTimeout(function() {
			
					var load_elements = [];
					var windowScrollTop = $(window).scrollTop();
					var windowScrollBottom = windowScrollTop + $(window).height();
					var i, llelem_top, llelem_bottom;
				
					// Cycle through llelements and check if they are within viewpane
					for(i = 0; i < llelements.length; i++) {
					
						// Get top and bottom of llelem
						llelem_top = llelements[i].getTop();
						llelem_bottom = llelements[i].getBottom();
				
						if(
					
						// Top edge						
						(llelem_top >= windowScrollTop && llelem_top <= windowScrollBottom) ||
					
						// Bottom edge
						(llelem_bottom >= windowScrollTop && llelem_bottom <= windowScrollBottom) ||
					
						// In full view
						(llelem_top <= windowScrollTop && llelem_bottom >= windowScrollBottom)) {
						
							// Grab index of llelements that will be loaded
							if(settings.repeatLoad || !llelements[i].loaded) load_elements.push(i);
						
						}
					}
			
					// Call onLoadingStart event
					if(settings.onLoadingStart.call(undefined, e, llelements, load_elements)) {
				
						// Cycle through array of indexes that will be loaded
						for(i = 0; i < load_elements.length; i++) {
					
							// Set loaded flag
							llelements[load_elements[i]].loaded = true;
					
							// Call the individual element onLoad
							if(settings.onLoad.call(undefined, e, llelements[load_elements[i]]) === false) break;
						
						}
					
						// Call onLoadingComplete event
						settings.onLoadingComplete.call(undefined, e, llelements, load_elements);
				
					}
				
				}, settings.timeout);
			
			});
		
			// LazyLoadElement class
			function LazyLoadElement($element) {
			
				var self = this;
					
				this.loaded = false;
				this.$element = $element;
				this.top = undefined;
				this.bottom = undefined;
				
				this.getTop = function() {
					if(self.top) return self.top;
				
					return self.$element.offset().top;
				}
				
				this.getBottom = function() {
					if(self.bottom) return self.bottom;
				
					var top = (self.top) ? self.top : this.getTop();
					return top + self.$element.outerHeight(settings.includeMargin);
				}
				
				// Cache the top and bottom of set
				if(settings.cache) {
					this.top = this.getTop();
					this.bottom = this.getBottom();
				}
			
			}
		
			// Cycle throught the selector(s)
			var chain = $selector.each(function() {
		
				// Add LazyLoadElement classes to the main array
				llelements.push(new LazyLoadElement($(this)));
			
			});
		
			return chain;
		},
	
		'destroy': function() {
			$window.unbind('scroll.lla');
		},
		
		'load': function() {
			force_load_flag = true;
			$window.trigger('scroll.lla');
		}
	
	}

	$.fn.lazyloadanything = function(method) {

		// Method calling logic
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
			
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.lazyloadanything');
		}

	};
	
})( jQuery );
