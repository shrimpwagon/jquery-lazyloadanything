jquery-lazyloadanything
=======================

Trigger events when elements come into view - binds events to the vertical and horizontal scroll listener. This plugin was designed to go beyond just lazy loading images. It basically triggers events whenever specified elements become visible in the view pane via scrolling in either direction. You can dynamically load any kind of content or do any type of jQuery or Javascript executing you wish. The triggering elements are determined by the jQuery selector and are accessible during event firing. Plugin can be applied to multiple selectors on the same page.

Basic Image Loading Syntax
------------
This example is showing how the image source url is stored in the `data-src` attribute and loads into the `src` attribute when the user scrolls into view of the image. Of course, the selector will most likely be more specific.

    $('img').lazyloadanything({
        'onLoad': function(e, LLobj) {
            var $img = LLobj.$element;
            var src = $img.attr('data-src');
            $img.attr('src', src);
        }
    });

Element with Class Loaded in Viewport
-------------
This example shows how to turn the background of elements red when it is lazy loaded into the viewport.

    $('.red-bg-onload').lazyloadanything({
        'onLoad': function(e, LLobj) {
            LLobj.$element.css('background-color', 'red');
        }
    });

Each [onLoad](#onload) call passes the [LLobj](#llobj) variable which is a Lazy Load object that contains 4 properties and two methods.

LLobj
-----
Lazy Load object

### LLobj.top
The element's top Y position from top of the document body if [cache](#cache) is turned on.

### LLobj.bottom
The element's bottom Y position from top of the document body if [cache](#cache) is turned on.

### LLobj.loaded
Boolean flag signifying whether the [onLoad](#onload) event has already triggered for the corresponding element. This keeps the element from triggering again if scrolling over multiple times however this can be overridden with the plugin [settings](#settings).

### LLobj.$element
The jQuery object derived from the element.

### LLobj.getTop()
Returns the element's top Y position from top of the document body.

### LLobj.getBottom()
Returns the element's bottom Y position from top of the document body.

Settings
--------
### `auto`

Default: `true`

Boolean value that allows the element to trigger the [onLoad](#onload) event automatically when scrolled into view. If set to `false`, the `$.fn.lazyloadanywhere('load')` method can be called to force trigger all applicable, in view, elements to call the [onLoad](#onload) function. This will not force load any elements whose [LLobj](#llobj) object's loaded property is already set to true, to override this see [repeatLoad](#repeatload).

### `cache`

Default: `false`

If set to `true`, the [LLobj](#llobj) objects' top and bottom properties will be set on plugin initialization. This is helpful if you apply the plugin to a lot of elements. Setting it to `true` may speed up the script however those elements' position, size and visibility must not change. If they change you must call the `$.fn.lazyloadanywhere('destroy')` method and reinitialize the plugin.

### `timeout`

Default: `1000`

Timeout in seconds before any loading events trigger. Helpful when user is scrolling quickly through the page.

### `includeMargin`

Default: `false`

Boolean setting which specifies whether the elements' margin is considered as being part of the viewable element and will trigger the [onLoad](#onload) event.

### `repeatLoad`

Default: `false`

Boolean setting which allows the [onLoad](#onload) event to always trigger regardless of the [LLobj](#llobj) objects' [loaded](#llobjloaded) property. In other words, it will not just fire once but each time the element comes into view.

### `onLoadingStart`

Default: `function(e, LLobjs, indexes) { return true }`

Event that is triggered before any [LLobj](#llobj) objects are triggered. Returning boolean `false` will cancel any [LLobj](#llobj) objects from loading.

Arguments:
+ `e` The window scroll event.
+ `LLobjs` Array of **All** of the [LLobj](#llobj) objects from the initial jQuery selector initialization.
+ `indexes` Array of indexes corresponding to the above `LLobjs` array that will be triggered.

### `onLoad`

Default: `function(e, LLobj) { return true }`

Event that is triggered when the element comes into view, ie. when the element appears in the browser view pane. Returning boolean `false` will cancel any of the following load events.

Arguments:
+ `e` The window scroll event.
+ `LLobj` The triggering [LLobj](#llobj) object.

### `onLoadComplete`

Default: `function(e, LLobjs, indexes) { return true }`

Event that is triggered after [LLobj](#llobj) objects are triggered.

Arguments:
+ `e` The window scroll event.
+ `LLobjs` Array of **All** of the [LLobj](#llobj) objects from the initial jQuery selector initialization.
+ `indexes` Array of indexes corresponding to the above `LLobjs` array that have triggered.

Methods
-------
### `destroy`

Usage: `$.fn.lazyloadanything('destroy')`

Will remove **All** Lazy Load events including any multiple plugin initializations/selectors. If you add Lazy Load functionality to one jQuery selector and add some other functionality to another jQuery selector one method call to destroy will stop/unbind all scroll listening, ie. functionality.

### `load`

Usage: `$.fn.lazyloadanything('load')`

Will force load any applicable (in-view) elements. This is helpful to dynamically load content when page is first loaded since it takes scrolling to activate the events. This method works well with the [auto](#auto) setting set to `false`.

Requirements and Compatability
------------

jQuery >= 1.8

Seems to work in all modern browsers.

I haven't taken the time to test multiple browser and jQuery versions but this is a simple plugin and I'm sure will work fine under many different environment arrangements.

Let me know otherwise.

Take care, God bless.
