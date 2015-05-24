(function () {

	//Monitor if within proximity of up to 20 iBeacons (allowed 
    //by Apple), even when app is not running. This is ideal
    //for larger areas, like entering a museum or navigating
    //between multiple buildings or very, very large rooms
	var monitorBeacons = [
        {
            identifier:'ib1',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:1
        },
        {
            identifier:'ib2',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:2
        },
        {
            identifier:'ib3',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:3
        },
        {
            identifier:'ib4',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:4
        }
    ];

    //When app is active, track the distance from iBeacons,
    //activating content for the closest iBeacon.
    //Range as many iBeacons at a time as you like, but no
    //more than 4,294,836,225 at a time.
    //??? Would you only want to range a set of iBeacons
    //if within a certain area(s) triggered by the iBeacons
    //being monitored (proximity)?
    //??? What is the energy requirments for ranging a bajilion
    //iBeacons?
    var rangeBeacons = [
        {
            identifier:'LightBlue1',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:1,
            rssi:-999,
            prox:'unknown',
            closest: false
        },
        {
            identifier:'ib2',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:2,
            rssi:-999,
            prox:'unknown',
            closest: false
        },
        {
            identifier:'ib3',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:3,
            rssi:-999,
            prox:'unknown',
            closest: false
        },
        {
            identifier:'ib4',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:4,
            rssi:-999,
            prox:'unknown',
            closest: false
        },
    ];

    //test function
    var logToDom = function(message) {
        var elem = document.getElementById('domLog'); //pretty dom huh? Need to explore a console-like solution
            elem.innerHTML = message;
    };

    //create markup for range list
    //!!! I know! markup mixed in with logic.... I know! I know...
    var createRangeListMarkup = function() {
        var i, html, elem;
        var html = '';
        for(i=0; i<rangeBeacons.length; i++) {
            //I KNOW!...
            //!!! consider also showing "accuracy"
            html += '<div class="row">' + "\n";
            html += '   <div id="rBeaconColor' + i + '" class="col col-color color-' + i + '"></div>' + "\n";
            html += '   <div id="rBeaconStar' + i + '" class="col col-star star-not"></div>' + "\n";
            html += '   <div id="rBeaconRange' + i + '" class="col col-range range-unknown"></div>' + "\n";
            html += '   <div id="rBeaconRangeLabel' + i + '" class="col col-range-label">SCANNING</div>' + "\n";
            html += '   <div id="rBeaconIdentifyer' + i + '" class="col col-identifier">' + rangeBeacons[i].identifier + '</div>' + "\n";
            html += '   <div id="rBeaconRSSI' + i + '" class="col col-rssi">----</div>' + "\n";         
            html += '</div>' + "\n";
        }

        //place it
        document.getElementById('ranges').innerHTML = html;
    };

    //create markup for monitor list
    //!!! I know! markup mixed in with logic.... I know! I know...
    var createMonitorListMarkup = function() {
        var i, html, elem;
        var html = '';
        for(i=0; i<monitorBeacons.length; i++) {
            //I KNOW!...
            html += '<div class="row">' + "\n";
            html += '   <div id="mBeaconColor' + i + '" class="col col-color color-outside"></div>' + "\n";
            html += '   <div id="mBeaconState' + i + '" class="col col-state state-outside"></div>' + "\n";
            html += '   <div id="mBeaconStateLabel' + i + '" class="col col-state-label">SCANNING</div>' + "\n";
            html += '   <div id="mBeaconIdentifier' + i + '" class="col col-state-identifier">' + monitorBeacons[i].identifier + '</div>' + "\n";        
            html += '</div>' + "\n";
        }

        //place it
        document.getElementById('monitors').innerHTML = html;
    };

    //handle location manager events for an iBeacon when monitoring distance from iBeacon
    var setDeligate = function() {
        var delegate = new cordova.plugins.locationManager.Delegate();

        //talked about as "monitoring"
        delegate.didDetermineStateForRegion = function (pluginResult) {
        	//var state;
            
            //update visuals for monitored iBeacon
            for(i=0; i<monitorBeacons.length; i++) {
            	if(pluginResult.region.uuid == monitorBeacons[i].uuid && pluginResult.region.major == monitorBeacons[i].major && pluginResult.region.minor == monitorBeacons[i].minor) {
            		//set state label values
            		if(pluginResult.state == "CLRegionStateInside") {
            			state = 'inside';
            		} else {
            			state = 'outside';
            		}

            		document.getElementById('mBeaconStateLabel' + monitorBeacons[i].i).innerHTML = state.toUpperCase();
            		document.getElementById('mBeaconState' + monitorBeacons[i].i).className = "col col-state state-" + state;
            	}
            }
            logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));
        };

        /*
        delegate.didStartMonitoringForRegion = function (pluginResult) {
            //console.log('didStartMonitoringForRegion:', pluginResult);

            logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };
        */

        //talked about as "ranging"
        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            var prox;

            //update visuals for ranged iBeacon
            for(i=0; i<rangeBeacons.length; i++) {
            	if(pluginResult.region.uuid == rangeBeacons[i].uuid && pluginResult.region.major == rangeBeacons[i].major && pluginResult.region.minor == rangeBeacons[i].minor) {
            		//set RSSI value
            		rangeBeacons[i].rssi = pluginResult.beacons[0].rssi;
            		document.getElementById('rBeaconRSSI' + rangeBeacons[i].i).innerHTML = pluginResult.beacons[0].rssi;

            		//set range/range label values
            		switch(pluginResult.beacons[0].proximity) {
            			case 'ProximityImmediate':
            				prox = 'immediate';
            				break;
            			case 'ProximityNear':
            				prox = 'near';
            				break;
            			case 'ProximityFar':
            				prox = 'far';
            				break;
            			case 'ProximityUnknown':
            				prox = 'unknown';
            				break;
            			default:
            				prox = 'unknown';
            		}

            		rangeBeacons[i].prox = prox;
            		document.getElementById('rBeaconRangeLabel' + rangeBeacons[i].i).innerHTML = prox.toUpperCase();
            		document.getElementById('rBeaconRange' + rangeBeacons[i].i).className = "col col-range range-" + prox;

            		//star closest iBeacon
            		starClosestBeacon();

            		//logToDom('[DOM] beaconRegion: ' + JSON.stringify(rangeBeacons[i].region));

            		break;
            	}
            }

            //logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
        };

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        //!!! might be nice to show a message about the "this app wishes to monitor you location"
        //explaining what how iBeacons will be used to enrich the experience before the user
        //things we are tracking them in their sleep...
        
        //if monitoring only when app is active
        //cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        //OR if monitoring all the time:
        //cordova.plugins.locationManager.requestAlwaysAuthorization();

        //!!!
        //required if using monitoring??
        //https://github.com/petermetz/cordova-plugin-ibeacon/issues/98
        //also had to UNINSTALL, reinstall on iOS to see changes
        cordova.plugins.locationManager.requestAlwaysAuthorization();
    };

	//mark the closest iBeacon with a star
	//great when thinking about when to trigger content for the closest iBeacon
    var starClosestBeacon = function() {
    	var i;
    	var closest = {uuid:'none', rssi:-999}; //none to be found to start
    	for(i=0; i<rangeBeacons.length; i++) {
    		if(rangeBeacons[i].prox != "unknown") {
    			if(rangeBeacons[i].rssi > closest.rssi) {
    				closest = rangeBeacons[i];
    			}
    		}
    	}

    	//only update markup if closest iBeacon not closest previously
    	if(closest.closest == false) {
    		for(i=0; i<rangeBeacons.length; i++) {
    			if(closest.i == i) {
    				document.getElementById('rBeaconStar' + rangeBeacons[i].i).className = "col col-star star-active";
    			} else {
    				document.getElementById('rBeaconStar' + rangeBeacons[i].i).className = "col col-star star-not";
    			}
    		}
    	}
    }

    // Start monitoring if within proximity of iBeacons (with app running or not!)
    var startMonitoringBeacons = function() {
        var i;

        for(i=0; i<monitorBeacons.length; i++) {
            //set i for display update purposes for now (instead of "redrawing" everything for now)
            monitorBeacons[i].i = i;

            //set iBeacon's region
            monitorBeacons[i].region = new cordova.plugins.locationManager.BeaconRegion(monitorBeacons[i].identifier, monitorBeacons[i].uuid, monitorBeacons[i].major, monitorBeacons[i].minor);

            //start monitoring the iBeacon!
            cordova.plugins.locationManager.startMonitoringForRegion(monitorBeacons[i].region)
				.fail(console.error)
				.done();

            //logToDom(monitorBeacons[i].identifier + ", " + monitorBeacons[i].uuid + ", " + monitorBeacons[i].major + ", " + monitorBeacons[i].minor);
        }
    };

    // Start monitoring iBeacon ranges
    var startRangingBeacons = function() {
        var i;

        for(i=0; i<rangeBeacons.length; i++) {
            //set i for display update purposes for now (instead of "redrawing" everything for now)
            rangeBeacons[i].i = i;

            //set iBeacon's region
            rangeBeacons[i].region = new cordova.plugins.locationManager.BeaconRegion(rangeBeacons[i].identifier, rangeBeacons[i].uuid, rangeBeacons[i].major, rangeBeacons[i].minor);

            //start ranging the iBeacon!
            cordova.plugins.locationManager.startRangingBeaconsInRegion(rangeBeacons[i].region)
                .fail(console.error)
                .done();
        }
    };

    // Application Constructor
    var initialize = function() {
        bindEvents();
    };

    //deviceready event handler
    var onDeviceReady = function() {
        try {
            createRangeListMarkup();
            startRangingBeacons();

            createMonitorListMarkup();
            startMonitoringBeacons();

            //manage iBeacon monitoring/ranging events
            setDeligate();
        
        } catch(err) {
            alert(err);
            logToDom(err.message);
        }
        
    };

    //get the show started when the device is ready
    document.addEventListener('deviceready', onDeviceReady, false);

})();