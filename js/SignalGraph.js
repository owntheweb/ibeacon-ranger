function SignalGraph() {
	//create colors used as a key for RSSI strength graph and graph line colors
    //!!! may want to make this list longer in case monitoring more iBeacons
    //!!! currently this only affects lines, need to write css dynamically to replace need for existing CSS?
    this.rangeColors = [
    	'#ff0000',
    	'#ffff00',
    	'#26ff00',
    	'#00ffff',
    	'#001fff',
    	'#ff00ff',
    	'#ff7f00',
    	'#7dff00',
    	'#a700ff',
    	'#cccccc'
    ];

    this.plotXpx = 5; //distance between each x scroll and point x
    
    //higher the number, stroger the signal
    //e.g. -30 is higher than -90
    this.minRSSI = 0; //observed about -10, start with 0 for now for easy math
    this.maxRSSI = -100; //observed about -90, start with -100 now for easy math

    this.canvas = document.getElementById("signalCanvas");
	this.context = this.canvas.getContext('2d');

	this.width = window.innerWidth;
    this.height = 150;

    this.ranges = []; //an array of ranges containing arrays of RSSI readings
}

//draw the graph on canvas
SignalGraph.drawGraph = function() {
	var i, n, y, length;
	this.context.clearRect(0, 0, this.width, this.height);

	//get longest dataset length
	/*
	length = 0;
	for(i=0; i<this.ranges.length) {
		if(this.ranges[i].length > length) {
			length = this.ranges[i].length;
		}
	}
	*/

	
	for(i=0; i<this.ranges.length; i++) {
		for(n=0; n<this.ranges[i].length; n++) {
			y = (this.ranges[i][n] - this.minRSSI) / this.maxRSSI * this.height;

			if(n == 0) {
				this.context.beginPath();
				this.lineWidth = 2;
				this.lineStyle = this.rangeColors[i];
				this.context.context.moveTo(n * this.plotXpx, y);
			} else {
				this.context.context.lineTo(n * this.plotXpx, y);
			}

			if(n == this.ranges[i].length - 1) {
				context.stroke();
			}
		}
	}
};

//clear out old data that scrolled past longest width/height
SignalGraph.trimData = function() {
	//!!! do something
};

SignalGraph.appendRangeData = function(rssi, accuracy, beaconIndex) {

	this.ranges[beaconIndex].append({rssi:rssi, acc:accuracy});
	
	this.trimData();
	this.drawGraph();
}

//size graph to window width
SignalGraph.sizeGraph = function() {
	this.width = window.innerWidth;

	this.context.canvas.width = this.width;
	this.context.canvas.height = this.height;
};

SignalGraph.init = function(beaconCount) {
	var i;
	
	//add beadon data placeholders
	for(i=0; i<beaconCount; i++) {
		this.ranges.push([]);
	}

	//set initial size of graph
	this.sizeGraph();

	//size again if orientation changes
	window.addEventListener('resize', function() { SignalGraph.sizeGraph(); }, false);
};