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

    this.canvas = document.getElementById("signalGraph");
	this.context = this.canvas.getContext('2d');

	this.width = window.innerWidth;
    this.height = 150;

    this.ranges = []; //an array of ranges containing arrays of RSSI readings
}

//log messages to the app screen, mostly for testing
SignalGraph.prototype.logToDom = function(message) {
    document.getElementById('domLog').innerHTML = message; //pretty dom huh? Need to explore a console-like solution
};

//draw the graph on canvas
SignalGraph.prototype.drawGraph = function() {
	var i, n, y, length;
	this.context.clearRect(0, 0, this.width, this.height);
	
	for(i=0; i<this.ranges.length; i++) {
		for(n=0; n<this.ranges[i].length; n++) {
			if(this.ranges[i][n].rssi == 0) {
				this.ranges[i][n].rssi = this.maxRSSI;
			}

			y = (this.ranges[i][n].rssi - this.minRSSI) / this.maxRSSI * this.height;
			//this.logToDom(y);

			if(n == 0) {
				this.context.beginPath();
				this.context.lineWidth = 2;
				this.context.strokeStyle = this.rangeColors[i];
				this.context.moveTo(n * this.plotXpx, y);
			} else {
				this.context.lineTo(n * this.plotXpx, y);
			}

			if(n == this.ranges[i].length - 1) {
				this.context.stroke();
			}
		}
	}
};

//clear out old data that scrolled past longest width/height
SignalGraph.prototype.trimData = function(beaconIndex) {
	if(this.ranges[beaconIndex].length > (this.width / this.plotXpx)) {
		this.ranges[beaconIndex].shift();
	}
};

SignalGraph.prototype.pushRangeData = function(rssi, accuracy, beaconIndex) {

	this.ranges[beaconIndex].push({rssi:rssi, acc:accuracy});
	
	this.trimData(beaconIndex);
	this.drawGraph();
}

//size graph to window width
SignalGraph.prototype.sizeGraph = function() {
	this.width = window.innerWidth;

	this.context.canvas.width = this.width;
	this.context.canvas.height = this.height;
};

SignalGraph.prototype.init = function(beaconCount) {
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