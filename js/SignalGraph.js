/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
    this.maxRSSI = -10; //observed about -10, no more, start from here
    this.minRSSI = -90; //observed about -90, no less, start from here

    this.canvas = document.getElementById("signalGraph");
	this.context = this.canvas.getContext('2d');

	this.width = window.innerWidth;
    this.height = 150;

    this.curRanges = []; //update current ranges with scan events, update ranges in a time interval to better handle disconnects 
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
				this.ranges[i][n].rssi = this.minRSSI;
			}

			y = (this.ranges[i][n].rssi - this.maxRSSI) / this.minRSSI * this.height;

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

//clear out old data that scrolled past the screen
SignalGraph.prototype.trimData = function(beaconIndex) {
	
	//draw out to the longest dimension in case of orientation change
	var width = this.width;
	/* //!!! this part causing graph to start off screen for portrait orientation
	if(this.height > width) {
		width = this.height;
	}
	*/

	while(this.ranges[beaconIndex].length > width / this.plotXpx) {
		this.ranges[beaconIndex].shift();
	}
};

SignalGraph.prototype.pushRangeData = function(rssi, accuracy, beaconIndex) {
	this.curRanges[beaconIndex] = {rssi:rssi, acc:accuracy};
}

//update graph data once per second (about rate of individual iBeacon udpates)
SignalGraph.prototype.addToGraph = function() {
	var i;

	for(i=0; i<this.curRanges.length; i++) {
		this.ranges[i].push({rssi:this.curRanges[i].rssi, acc:this.curRanges[i].accuracy});
		this.trimData(i);
	}

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
		this.curRanges.push({rssi:0, acc:0.0});
		this.ranges.push([[{rssi:0, acc:0.0}]]);
	}

	//set initial size of graph
	this.sizeGraph();

	//size again if orientation changes
	window.addEventListener('resize', function() { this.sizeGraph(); }.bind(this), false);

	//start graph updates
	setInterval(function(){ this.addToGraph(); }.bind(this), 1000);
};