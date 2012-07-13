/**
 * swipe.js - JavaScript to swipe navigation
 */
(function($, window, document, undefined){

var

    // the usual suspects
    round = window.Math.round,

    // page state
    offset = 0,
    startX = null,
    startY = null,
    
    // trigger type
    trigger = null,
    
    // cached jQuery resultsets
    $wrapper = $('.wrapper'),
    $content = $wrapper.find('.content'),
    $sections = $content.find('.item'),
    
    // minimum offset
    minoffset = -100 * ($sections.length - 1);

/**
 * find the position of an event
 */
function position(event) {
    
    var
        touch,
        x,
        y;

    if (event.touches && event.touches.length) {
        touch = event.touches[0];
        x = touch.pageX;
        y = touch.pageY;
    } else if (event.changedTouches && event.changedTouches.length) {
        touch = event.changedTouches[0];
        x = touch.pageX;
        y = touch.pageY;
    } else if (event.pageX !== undefined && event.pageY !== undefined) {
        x = event.pageX;
        y = event.pageY;
    } else if (event.clientX !== undefined && event.clientY !== undefined) {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    return { x: x, y: y };
}

/**
 * handler for the initial interaction
 */
function contact(event) {
    
    // set up trigger type
    if (!trigger) {
        trigger = event.type;
    }
    
    // only interact with triggered events
    if (trigger === event.type) {
        
        event.preventDefault();

        // record the starting position
        var pos = position(event);
        startX = pos.x;
        startY = pos.y;
        
        // stop the content from animating
        $content.stop();
        
    }
    
}

/**
 * handler for the intermediate action
 */
function move(event) {
    
    // only interact if after contact
    if (startX !== null && startY !== null) {
    
        event.preventDefault();

        // calculate the new offset    
        var
            
            pos = position(event),
            width = $(document).width(),
            delta = 100 * (pos.x - startX) / width,
            newoffset = offset + delta;

        // bound by high and low values
        if (newoffset > 0) {
            newoffset = 0;
        }
        if (newoffset < minoffset) {
            newoffset = minoffset;
        }
        
        // move content
        $content.css('left', newoffset + '%');
        
    }

}

/**
 * handler for the release
 */
function release(event) {
    
    // only interact if after contact
    if (startX !== null && startY !== null) {
        
        // calculate delta
        var
            
            pos = position(event),
            width = $(document).width(),
            delta = 100 * round( (pos.x - startX) / width ),
            newoffset = offset + delta;
            
        // reset offset, bounded by high and low values
        if (newoffset > 0) {
            newoffset = 0;
        }
        if (newoffset < minoffset) {
            newoffset = minoffset;
        }
        offset = newoffset;
        
        // animate towards offset
        $content.animate({
            left: offset + '%'
        }, 'slow');
        
        // reset markers and state
        startX = null;
        startY = null;
    
    }
    
}

/**
 * preventDefault implementation for IE
 */
function preventDefault() {
    this.returnValue = false;
}

/**
 * addEvent - I'd rather not, but jQuery seems to drop 'touches' :/
 * Note: This is my own take on a currying addEvent implementation.
 */
function addEvent(elem) {
    function bind(type, handler) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (elem.attachEvent) {
            function callback() {
                var e = window.event;
                e.preventDefault = preventDefault;
                return handler.call(elem, e);
            }
            function remove(){
                elem.detachEvent("on" + type, callback);
                window.detachEvent("onunload", remove);
            }
            elem.attachEvent("on" + type, callback);
            window.attachEvent("onunload", remove);
        }
        return bind;
    }
    return bind;
}

// bind handlers
addEvent($wrapper[0])
    ('mousedown', contact)
    ('touchstart', contact)
    ('MozTouchDown', contact)
    ('mousemove', move)
    ('touchmove', move)
    ('MozTouchMove', move);
addEvent(document)
    ('mouseup', release)
    ('touchend', release)
    ('MozTouchRelease', release);


/**
 * handler for jump navigation
 */
function jump(event) {

    event.preventDefault();
    
    // retrieve target and calculate offset
    var
        href = this.href,
        id = href.substr(href.indexOf('#')),
        pos = $(id).position(),
        width = $(document).width();
        
    offset = -100 * round( pos.left / width );
    
    // animate towards offset
    $content.stop();
    $content.animate({
        left: offset + '%'
    }, 'slow');

}

// bind jump handler
//$('.nav ul a').bind('click', jump);

})(window.jQuery, window, window.document);
