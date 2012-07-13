/**
Begin coding
**/

$.fn.moveSlide = function() {

        var offset = null;
		var currentposcount = 0;
		
		var child = $(this).find('div');
		var width = $(window).width();
		$(this).width(child.length * width);
		child.width(width);
		child.first().addClass('Active');
		child.each(function(event) {
			$(this).addClass('item'+event);
		});

		//Touch start
        var start = function(e) {
          var orig = e.originalEvent;
          var pos = $(this).position();
		  startX = pos.left;
		  
          offset = {
            x: orig.changedTouches[0].pageX - pos.left,
            //y: orig.changedTouches[0].pageY - pos.top
          };
        };
		
		//Touch move
        var move = function(e) {
          e.preventDefault();
          var orig = e.originalEvent;
		  var left = orig.changedTouches[0].pageX - offset.x;
		  
          $(this).css({
            left: orig.changedTouches[0].pageX - offset.x
          });
		};
		  		  
		  //Touch end
	    var release = function(e) {
          e.preventDefault();
		  
		
		  var orig = e.originalEvent;
		  var currentpos = $(this).position();
		  
		  var touchpos = orig.changedTouches[0].pageX;
		  var left = touchpos - offset.x;
		  
		  var quarter = Math.round(width/4);
		  var currentposcount = ($(this).find('.Active').index())+1;
		  var leftM = 0;
		  //Move object deterniming which side it's moving
			if(touchpos < quarter && currentposcount < child.length) { //if less thand 1 third to left then move to prev slide
				var leftM = -width*currentposcount;
				$(this).stop().animate({
					left: leftM
				}, 'slow');
				$(this).find('.Active').removeClass('Active').next().addClass('Active');
				returnM = leftM
				
			} else if(touchpos > (quarter*3) && currentposcount > 1) { //if less thand 1 third to left then move to next slide
				if(currentposcount > 2) { leftM = -width*(currentposcount-2)}
					$(this).animate({
						left: leftM
					}, 'slow');
				
				$(this).find('.Active').removeClass('Active').prev().addClass('Active');
				returnM = leftM
				
			} else {//Return to current position
					if(currentposcount == 1) {returnM = 0}
					$(this).animate({
						left: returnM
					}, 'slow');
			}
			
        };
		
        this.bind("touchstart", start);
        this.bind("touchmove", move);
		this.bind("touchend", release);
		
      };
	
$(document).ready(function() {
   $(".shirt").moveSlide();
   $(".hat").moveSlide();
   $(".short").moveSlide();
   $(".sock").moveSlide();
  
 // Debugger.initialize();
  });


/*  
//Debugger
var Debugger = {
	
	// Properties.
	cont: null,
	
	
	// Initialize the Debugger tool.
	initialize: function()
	{
		this.cont = $('<div style="position:fixed;top:5;left:5;display:block;"></div>');
		$("body").append(this.cont);
	},
	
	
	// Display a debug message on the screen.
	write: function(msg)
	{
		var box = $('<div style="font-size:11px;font-family:Consolas;background:#FC9;padding:2px 6px;margin-bottom:2px;">' + msg + '</div>');
		this.cont.prepend(box);
		
		box.hide();
		box.fadeIn(200, 'linear', function()
		{
			setTimeout(function()
			{
				box.fadeOut(200, 'linear', function()
				{
					box.remove();
					
				});
				
			}, 5000);
			
		});
	}

};
*/




