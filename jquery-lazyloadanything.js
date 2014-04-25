/*!
	jQuery LazyLoadAnything - 2013-03-04
	(c) 2013 Shawn Welch http://shrimpwagon.wordpress.com/jquery-lazyloadanything
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function( $ ) {

	// Element to listen to scroll event
	var $listenTo;

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
				'viewportMargin': 0,
				'repeatLoad': false,
				'listenTo': window,
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
			$listenTo = $(settings.listenTo);
			var timeout = 0;
			var llelements = [];
			var $selector = this;

			// Scroll listener
			$listenTo.bind('scroll.lla', function(e) {
		
				// Check for manually/auto load
				if(!force_load_flag && !settings.auto) return false;
				force_load_flag = false;
		
				// Clear timeout if scrolling continues
				clearTimeout(timeout);
		
				// Set the timeout for onLoad
				timeout = setTimeout(function() {
				
					/*
					x1, y1 o----------------------o x2, y1
						   |                      |
						   |                      |
						   |                      |
						   |                      |
						   |                      |
						   |                      |
						   |                      |
						   |                      |
					x1, y2 o----------------------o x2, y2
					*/
					
					var viewport_left = $listenTo.scrollLeft();
					var viewport_top = $listenTo.scrollTop();
					var viewport_width = $listenTo.innerWidth();
					var viewport_height = $listenTo.innerHeight();
					var viewport_x1 = viewport_left - settings.viewportMargin;
					var viewport_x2 = viewport_left + viewport_width + settings.viewportMargin;
					var viewport_y1 = viewport_top - settings.viewportMargin;
					var viewport_y2 = viewport_top + viewport_height + settings.viewportMargin;
					
					var load_elements = [];
					var i, llelem_top, llelem_bottom;
				
					// Cycle through llelements and check if they are within viewpane
					for(i = 0; i < llelements.length; i++) {
                                                
						// Get top and bottom of llelem
						var llelem_x1 = llelements[i].getLeft();
						var llelem_x2 = llelements[i].getRight();
						var llelem_y1 = llelements[i].getTop();
						var llelem_y2 = llelements[i].getBottom();
                                                
						if(llelements[i].$element.is(':visible'))
						{
							if((viewport_x1 < llelem_x2) && (viewport_x2 > llelem_x1) && (viewport_y1 < llelem_y2) && (viewport_y2 > llelem_y1)) {

									// Grab index of llelements that will be loaded
									if(settings.repeatLoad || !llelements[i].loaded) load_elements.push(i);

							}
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
				this.left = undefined;
				this.right = undefined;
				
				this.getTop = function() {
					if(self.top) return self.top;
				
					return self.$element.position().top;
				}
				
				this.getBottom = function() {
					if(self.bottom) return self.bottom;
				
					var top = (self.top) ? self.top : this.getTop();
					return top + self.$element.outerHeight(settings.includeMargin);
				}
				
				this.getLeft = function() {
					if(self.left) return self.left;
				
					return self.$element.position().left;
				}
				
				this.getRight = function() {
					if(self.right) return self.right;
				
					var left = (self.left) ? self.left : this.getLeft();
					return left + self.$element.outerWidth(settings.includeMargin);
				}
				
				// Cache the top and bottom of set
				if(settings.cache) {
					this.top = this.getTop();
					this.bottom = this.getBottom();
					this.left = this.getLeft();
					this.right = this.getRight();
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
			$listenTo.unbind('scroll.lla');
		},
		
		'load': function() {
			force_load_flag = true;
			$listenTo.trigger('scroll.lla');
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
