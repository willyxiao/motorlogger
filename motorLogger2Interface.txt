motorLogger2: 

	I tried to keep motorLogger2 as general as motorLogger. This allows anyone
	to just pick up the file and add it to their test. 

	It can also be made very specific via the "metadata" passed into the startMotorLog function, or the data passed into the setData function 
	
	For example, in metadata, you can give the coordinates of a button. 
	Then in the parser, you can figure out if the button has been clicked by matching all mouseDown
	events with the coordinates of the button. 

	motorLogger2 also collects data-attributes of all the divs that it clicks. This means you can also put 
	information that you want to mouselog to capture about the divs in a data-ATTRIBUTENAME tag. 

Interface : 
	type Motorlog = {
		metadata : yourmetadata,
		moves : [Move, Move ...]
	}

	type Move = {
		a : action, 
		
		// everything but a setData has a timestamp
		[t : timestamp], 
		
		// leave, scroll, enter, and setData do not have positions
		[p : position of the mouse], 
		
		// only on mouse-down, mouse-up, and click events
		[taType : target-type],
		[taPos : target-pos],
		[taData : target-data] //all the data attributes of a clicked element
	}

	function startMouseLog(metadata) -> null
		// starts the mouseLogger and saves any "metadata" that is passed to the function
		Note : the mouseLogger must be stopped before you can start it 
	
	function stopMouseLog() -> null
		// stops the mouseLogger and pushes all data onto the end of the motorLog
		Note : the mouseLogger must be started before you can stop it

	function sendMotorLog(destinationURL) -> null
		// sends an ajax request to "destinationURL" with an array of the motorLogs currently stored in cache
		Note : this will not stop the mouseLogger or send any of the currently logging data. 
			stopMotorLog() must be called first if you want to do that. 
			
	function setData(data) -> null 
		// appends the data onto the end of the current motorLog as {a : "setData", data : data}
		Note : the mouseLogger must be started before you can set the data, otherwise use startMouseLog(metadata).

Example Output to Server : 
	{"ML":[
		{"MD":"10","M":
			[{"a":"m","t":"1374166391095","p":"237,111"},
			{"a":"m","t":"1374166391103","p":"243,111"},
			{"a":"m","t":"1374166391111","p":"255,111"},
			{"a":"m","t":"1374166391119","p":"267,111"},
			{"a":"m","t":"1374166391127","p":"282,111"},
			{"a":"m","t":"1374166391135","p":"294,111"},
			{"a":"m","t":"1374166391143","p":"309,111"},
			{"a":"m","t":"1374166391151","p":"318,111"},
			{"a":"m","t":"1374166391159","p":"339,111"},
			{"a":"m","t":"1374166391167","p":"357,111"},
			{"a":"m","t":"1374166391175","p":"375,111"},
			{"a":"m","t":"1374166391183","p":"390,111"},
			{"a":"m","t":"1374166391191","p":"402,111"},
			{"a":"m","t":"1374166391199","p":"408,111"},
			{"a":"m","t":"1374166391207","p":"414,111"},
			{"a":"m","t":"1374166391255","p":"420,111"},
			{"a":"m","t":"1374166391263","p":"423,111"},
			{"a":"m","t":"1374166391271","p":"432,111"},
			{"a":"m","t":"1374166391287","p":"435,111"}]},
		{"MD":"18","M":
			[{"a":"e-d","t":"1374166399064","p":"204,48","taType":"hit:mouseTarget-DIV->DIV-id:foo","taPos":"1,855,14,10,40","taData":{"first":"quux","second":"booboo"}},
			{"a":"e-u","t":"1374166399184","p":"204,48","taType":"hit:mouseTarget-DIV->DIV-id:foo","taPos":"1,855,14,10,40","taData":{"first":"quux","second":"booboo"}},
			{"a":"e-c","t":"1374166399187","p":"204,48","taType":"hit:mouseTarget-DIV->DIV-id:foo","taPos":"1,855,14,10,40","taData":{"first":"quux","second":"booboo"}},
			{"a":"m","t":"1374166399189","p":"204,48"}]},
		{"MD":"21","M":
			[{"a":"e-d","t":"1374166401744","p":"249,33","taType":"miss:DIV","taPos":"1,851,26,10,10"},
			{"a":"e-u","t":"1374166401831","p":"249,33","taType":"miss:DIV","taPos":"1,851,26,10,10"},
			{"a":"e-c","t":"1374166401833","p":"249,33","taType":"miss:DIV","taPos":"1,851,26,10,10"},
			{"a":"setData", "data":{"foo":"bar","baz":"quux"}}, 
			{"a":"m","t":"1374166401837","p":"249,33"},
			{"a":"m","t":"1374166401967","p":"249,36"},
			{"a":"m","t":"1374166401983","p":"249,42"},
			{"a":"m","t":"1374166401999","p":"249,45"},
			{"a":"e-d","t":"1374166402271","p":"249,45","taType":"hit:mouseTarget-DIV->DIV-id:foo","taPos":"1,855,14,10,40","taData":{"first":"quux","second":"booboo"}},
			{"a":"e-u","t":"1374166402391","p":"249,45","taType":"hit:mouseTarget-DIV->DIV-id:foo","taPos":"1,855,14,10,40","taData":{"first":"quux","second":"booboo"}},
			{"a":"e-c","t":"1374166402396","p":"249,45","taType":"hit:mouseTarget-DIV->DIV-id:foo","taPos":"1,855,14,10,40","taData":{"first":"quux","second":"booboo"}},
			{"a":"m","t":"1374166402399","p":"249,45"},
			{"a":"m","t":"1374166402655","p":"249,48"},
			{"a":"m","t":"1374166402671","p":"249,51"},
			{"a":"m","t":"1374166402680","p":"249,60"}]}
	]}