(function () {

	//Monitor if within proximity of up to 20 iBeacons (allowed 
    //by Apple), even when app is not running. This is ideal
    //for larger areas, like entering a museum or navigating
    //between multiple buildings or very, very large rooms
	var monitorBeacons = [
        {
            identifier:'iBean',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:2
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
            identifier:'iBean',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:2
        }
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
        elem = document.getElementById('ranges');
        elem.innerHTML = html;
    };

    //handle location manager events for an iBeacon when monitoring if whithin proximity
    var setMonitorDeligate = function() {
        var i;
        var delegate = new cordova.plugins.locationManager.Delegate();
            
        delegate.didDetermineStateForRegion = function (pluginResult) {

            logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

            cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('didStartMonitoringForRegion:', pluginResult);

            logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            //update visuals for ranged iBeacon
            for(i=0; i<rangeBeacons.length; i++) {
            	if(pluginResult.region.uuid == rangeBeacons[i].uuid) {
            		document.getElementById('rBeaconRSSI' + rangeBeacons[i].i).innerHTML = pluginResult.beacons[0].rssi;
            		
            		break;
            	}
            }

            logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
        };

        return delegate;
    };

    //handle location manager events for an iBeacon when monitoring distance from iBeacon
    var setRangeDeligate = function() {
        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didDetermineStateForRegion = function (pluginResult) {

            logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

            cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('didStartMonitoringForRegion:', pluginResult);

            logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
        };

        return delegate;
    };

    // Start monitoring if within proximity of iBeacons (with app running or not!)
    var startMonitoringBeacons = function() {
        var i;
        var delegate = setMonitorDeligate();

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        //!!! might be nice to show a message about the "this app wishes to monitor you location"
        //explaining what how iBeacons will be used to enrich the experience before the user
        //things we are tracking them in their sleep...
        
        //if monitoring only when app is active
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        //OR if monitoring all the time:
        //cordova.plugins.locationManager.requestAlwaysAuthorization();

        for(i=0; i<monitorBeacons.length; i++) {
            //set iBeacon's region
            monitorBeacons[i].region = new cordova.plugins.locationManager.BeaconRegion(monitorBeacons[i].identifier, monitorBeacons[i].uuid, monitorBeacons[i].major, monitorBeacons[i].minor);

            //start monitoring the iBeacon!
            cordova.plugins.locationManager.startMonitoringForRegion(monitorBeacons[i].region)
                .fail(console.error)
                .done();
        }
    };

    // Start monitoring iBeacon ranges
    var startRangingBeacons = function() {
        var i;
        var delegate = setRangeDeligate();

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        //!!! check if this is possible for ranging?: cordova.plugins.locationManager.requestAlwaysAuthorization();

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


            //startMonitoringBeacons();
        
        } catch(err) {
            alert(err);
            logToDom(err.message);
        }
        
    };

    //get the show started when the device is ready
    document.addEventListener('deviceready', onDeviceReady, false);

})();