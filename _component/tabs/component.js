/********************************

	Name: WordPress Accessible Tabs
	Usage:

	TenUp.tabs({
		'target': '.tabs', // ID (or class) of the tab container
	}, function() {
		console.log('Amazing callback function!');
	});

********************************/

( function() {

	'use strict';

	// Define global TenUp object if it doesn't exist
	if ( 'object' !== typeof window.TenUp ) {
		window.TenUp = {};
	}

	window.TenUp.tabs = function( options, callback ) {

		if ( typeof options.target === 'undefined'  ) {
			return;
		}

		// Object.assign polyfill
		if (typeof Object.assign != 'function') {
			// Must be writable: true, enumerable: false, configurable: true
			Object.defineProperty(Object, "assign", {
			  value: function assign(target, varArgs) { // .length of function is 2
				'use strict';
				if (target == null) { // TypeError if undefined or null
				  throw new TypeError('Cannot convert undefined or null to object');
				}
		  
				var to = Object(target);
		  
				for (var index = 1; index < arguments.length; index++) {
				  var nextSource = arguments[index];
		  
				  if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
					  // Avoid bugs when hasOwnProperty is shadowed
					  if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					  }
					}
				  }
				}
				return to;
			  },
			  writable: true,
			  configurable: true
			});
		  }

		var defaults = {
			tabContent: 	'.tab-content',
			tabsList: 		'.tab-list',
			tabLinks: 		'.tab-list li > a',
			activeTab: 		'.tab-list li',
			tabItem: 		'.tab-item'
		}
		options = Object.assign(defaults, options);

		var tabs = document.querySelectorAll( options.target );

		// Simple forEach to make iteration easier
		var forEach = function( array, callback, scope ) {
			for ( var i = 0; i < array.length; i++ ) {
				callback.call( scope, i, array[i] ); // passes back stuff we need
			}
		};

		forEach( tabs, function( index, value ) {

			var tabContent   = tabs[index].querySelectorAll( options.tabContent ),
				tabsList     = tabs[index].querySelectorAll( options.tabsList ),
				tabLinks     = tabs[index].querySelectorAll( options.tabLinks ),
				activeTab    = tabs[index].querySelectorAll( options.activeTab );

			// Set state for the first .tab-item
			var firstTab = tabs[index].querySelectorAll( options.tabItem );
			firstTab[0].classList.add( 'is-active' );

			forEach( tabLinks, function( index, value ) {

				var tab = value;
				var tabId = 'tab-' + tab.getAttribute( 'href' ).slice( 1 );

				// Set ARIA and ID attributes
				tab.setAttribute( 'id', tabId );
				tab.setAttribute( 'aria-selected', false );
				tab.parentNode.setAttribute( 'role', 'presentation' );
				tabContent[index].setAttribute( 'aria-labelledby', tabId );
				tabContent[index].setAttribute( 'aria-hidden', true );

				tab.onclick = tabHandle;

				function tabHandle( event ) {

					event.preventDefault();

					// Handle opening and closing of the tabs on mobile devices
					if ( tab.parentNode.classList.contains( 'is-active' ) ) {
						tab.parentNode.parentNode.classList.toggle( 'm-is-active' );
					} else {
						tab.parentNode.parentNode.classList.remove( 'm-is-active' );
					}

					// Change state of previously selected activeTab item
					forEach( activeTab, function( index, value ) {

						if ( value.classList.contains( 'is-active' ) ) {
							value.classList.remove( 'is-active' );
							tabLinks[index].setAttribute( 'aria-selected', 'false' );
						}

					} );

					// Set state of newly selected tab list item
					tab.setAttribute( 'aria-selected', 'true' );
					tab.parentNode.classList.add( 'is-active' );

					// Change state of previously selected tabContent item
					forEach( tabContent, function( index, value ) {

						if ( value.classList.contains( 'is-active' ) ) {
							value.classList.remove( 'is-active' );
							tabContent[index].setAttribute( 'aria-hidden', 'true' );
						}

					} );

					// Show newly selected content
					tabContent[index].classList.add( 'is-active' );
					tabContent[index].setAttribute( 'aria-hidden', 'false' );

					// Set focus to the first heading in the newly revealed tab content
					if ( tabContent[index].querySelector( 'h2' ) ) {
						tabContent[index].querySelector( 'h2' ).setAttribute( 'tabindex', -1 );
						tabContent[index].querySelector( 'h2' ).focus();
					}

				}

				// Set state for the first .tab-content item
				tabContent[0].classList.add( 'is-active' );
				tabContent[0].setAttribute( 'aria-hidden', 'false' );

			} );

		} );

		// Execute the callback function
		if ( typeof callback === 'function' ) {
			callback.call();
		}
	};

} )();
