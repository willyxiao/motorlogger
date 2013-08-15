/*
* motorLogger2.js 
* For explanation look at motorLogger2Interface.txt
* Requires: jQuery
*/

var MotorLogger = (function($) {
        var Module = {};

	/* ======= EXPOSE THE FOUR FUNCTIONS IN THE INTERFACE ======== */
	Module.startMouseLog = startMouseLog; 
	Module.stopMouseLog = stopMouseLog; 
	Module.sendMotorLog = sendMotorLog; 
	Module.setData = setData; 

	/* ======== IMPLEMENTATION OF MOTORLOGGER ==================== */
	var motorLog = new Array();
        var debug = 0;

	// array to hold all moves, clicks, and metadata
	var motorLoggerMoves = new Array();
	var motorLoggerMetaData; 

	var mouseLogging = false; 

	function startMouseLog(metadata) {
		if(!mouseLogging) {
			mouseLogging = true; 
			motorLoggerMetaData = metadata; 
			
			document.addEventListener("mousemove", onMouseMove); 
			document.addEventListener("mouseenter", onMouseEnter); 
			document.addEventListener("mouseleave", onMouseLeave); 
			document.addEventListener("mouseup", onMouseUp); 
			document.addEventListener("mousedown", onMouseDown); 
			document.addEventListener("click", onClick); 
			document.addEventListener("scroll", onScroll); 
		} else {
			console.error("mouseLogger has already been started."); 
		}
	}

	function stopMouseLog() {
		if(mouseLogging) {		
			mouseLogging = false;

			document.removeEventListener("mousemove", onMouseMove); 
			document.removeEventListener("mouseenter", onMouseEnter); 
			document.removeEventListener("mouseleave", onMouseLeave); 
			document.removeEventListener("mouseup", onMouseUp); 
			document.removeEventListener("mousedown", onMouseDown); 
			document.removeEventListener("click", onClick); 
			document.removeEventListener("scroll", onScroll); 	
			
			// push the current motorlogger info onto the motorLog and reset
			// the motorLoggertemporary items
			motorLog[motorLog.length] = {
				metadata: motorLoggerMetaData, // metadata
				moves: motorLoggerMoves.slice(0), // moves
			}; 
			
			motorLoggerMetaData = null;	
			motorLoggerMoves.splice(0, motorLoggerMoves.length); 
		} else {
			console.error("mouseLogger has not been started."); 
		}
	}

	function setData(data) {
		if(mouseLogging) {
			motorLoggerMoves[motorLog.length] = {a : "setData", data : data}; 
		} else {
			console.error("mouseLogger has not been started."); 
		}
	}

	function onScroll(ev) {
		ev = ev || window.event;
		motorLoggerMoves[motorLoggerMoves.length] = {a : "scroll", t : ev.timeStamp};
	}

	function onMouseLeave(ev) {
		ev = ev || window.event;
		motorLoggerMoves[motorLoggerMoves.length] = {a : "break", t : ev.timeStamp};
	}

	function onMouseEnter(ev) {
		ev = ev || window.event;
		motorLoggerMoves[motorLoggerMoves.length] = {a : "enter", t : ev.timeStamp};
	}

	function onMouseMove(ev)
	{
		if (console && debug > 2) 
		console.log("m,"+ev.clientX+","+ev.clientY);

		ev = ev || window.event;
		motorLoggerMoves[motorLoggerMoves.length] = {a : "m", t : ev.timeStamp, p : ev.clientX + "," + ev.clientY};
	}

	function onMouseButtonEvent(ev, type) {
		ev = ev || window.event;
		if (console && debug) 
			console.log("Click on " + ev.target.type);
		
		// create a jQuery object for the element the click was performed on
		var jElement = $(ev.target);
		var targetType = "?";
		if (jElement.is("SELECT") || jElement.is("OPTION") || jElement.is("TEXTAREA") || jElement.is("BUTTON") || jElement.is("LABEL")) {
			targetType = "hit:" + ev.target.nodeName + "-id:" + jElement.attr("id");
		} else if (jElement.is("INPUT")) {
			targetType = "hit:" + ev.target.nodeName + "-" + ev.target.type + "-id:" + jElement.attr("id");
		} else {	
			// figure out if the click occured on an another type of clickable elemenet or an element whose parent is a valid target
			var enclosingTarget = getTheEnclosingTarget(jElement);
			targetType = "miss:" + ev.target.nodeName;
			if (enclosingTarget.el) {
				jElement = enclosingTarget.el;
				targetType = "hit:" + enclosingTarget.desc + "-id:" + jElement.attr("id");
			}
		}
		
		// get the location of the element (relative to the client)
		var offset = jElement.offset();
		var clientOffset = documentToClientCoordinates(ev, offset.left, offset.top);
		var dataAttr = jElement.data(); 

		// create log entry
		if (console && debug > 2) 
		console.log("e-" + type + ","+targetType+","+"1,"+jElement.width()+","+jElement.height()+","+clientOffset.x+","+clientOffset.y+","+ev.clientX+","+ev.clientY);

		motorLoggerMoves[motorLoggerMoves.length] = {
			a : "e-" + type, 
			t : ev.timeStamp, 
			p : ev.clientX + "," + ev.clientY,  
			taType : targetType, 
			taPos : "1,"+jElement.width()+","+jElement.height()+","+clientOffset.x+","+clientOffset.y,
			taData : dataAttr
		};
	}

	function documentToClientCoordinates(mouseEvent, documentX, documentY) {
		if (console && debug > 2) {
			console.log("About to convert coordinates");
			console.log("documentX: " + documentX);
			console.log("mouse client X: " + mouseEvent.clientX);
			console.log("mouse page X: " + mouseEvent.pageX);
		}
		return {
			x: documentX + mouseEvent.clientX - mouseEvent.pageX,
			y: documentY + mouseEvent.clientY - mouseEvent.pageY
		}
	}


	// click event handler
	function onClick(ev)
	{
		onMouseButtonEvent(ev, "c");
	}

	// click event handler
	function onMouseDown(ev)
	{
		onMouseButtonEvent(ev, "d");
	}

	// click event handler
	function onMouseUp(ev)
	{
		onMouseButtonEvent(ev, "u");
	}

	// this function will look up the ancestry chain to see
	// if the current element is enclosed by an anchor tag or an element with class "mouseTarget", or another legitimate clickable element;
	// it will return null if there was no enclosing anchor
	// tag or the anchor element + a string representation
	// of how far it had to go (e.g. A->DIV->SPAN)
	var getTheEnclosingTarget = function(jQelement) {
		if (jQelement == null || jQelement.is("body") || jQelement.is("html")) {
			return {
				el: null,
				desc: ""
			};
		}
		
		if (jQelement.is("A")) {
			return {
				el: jQelement,
				desc: "A"
			};
		}
		
		if (jQelement.hasClass("mouseTarget")) {
			return {
				el: jQelement,
				desc: "mouseTarget-" + jQelement[0].nodeName
			};
		}
		
		if (jQelement.attr("role") && jQelement.attr("role") == "button") {
			return {
				el: jQelement,
				desc: "Button-Aria"
			};
		}
		
		var res = getTheEnclosingTarget(jQelement.parent());
		if (res.el == null)
			return res;
		res.desc = res.desc + "->" + jQelement[0].nodeName;
		return res;    
	}

	var motorLogTemp = new Array();
	var motorLoggerSending = false;

	// function to send current data back to server
	function sendMotorLog(destinationURL, errorHandler) {
                 if (!destinationURL) {
                     console.error("Please provide a URL to send the motor log.");
                     return;
                 }

                 // Default AJAX error handler
                 errorHandler = errorHandler || 
                     function(j, t, e) { console.error([j, t, e]); };

		 if (!motorLoggerSending && motorLog.length > 0) {
			motorLoggerSending = true;
			motorLogTemp = motorLogTemp.concat(motorLog.slice(0)); 
			motorLog.splice(0, motorLog.length); 
			
			$.ajax({
				url: destinationURL,
				data: {
                                    motorlog: JSON.stringify(motorLogTemp.slice(0))
                                },
				type: 'POST',
				error: errorHandler,
				success: function(d,s,r){
					// if successful, then clear the local cache
					motorLogTemp.splice(0, motorLogTemp.length);
					// record that we are done sending
					motorLoggerSending = false;
				}
			});
		}
	}
        return Module;
})(jQuery);
