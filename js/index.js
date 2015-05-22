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
var app = {
    //Monitor if within proximity of up to 20 iBeacons (allowed 
    //by Apple), even when app is not running. This is ideal
    //for larger areas, like entering a museum or navigating
    //between multiple buildings or very, very large rooms
    monitorBeacons: [
        {
            identifier:'iBean',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:2
        }
    ],
    //When app is active, track the distance from iBeacons,
    //activating content for the closest iBeacon.
    //Range as many iBeacons at a time as you like, but no
    //more than 4,294,836,225 at a time.
    //??? Would you only want to range a set of iBeacons
    //if within a certain area(s) triggered by the iBeacons
    //being monitored (proximity)?
    //??? What is the energy requirments for ranging a bajilion
    //iBeacons?
    rangeBeacons: [
        {
            identifier:'iBean',
            uuid:'A495FF99-C5B1-4B44-B512-1370F02D74DE',
            major:1,
            minor:2
        }
    ],
    // !!! temporary test function
    logToDom: function(message) {
        var elem = document.getElementById('domLog'); //pretty dom huh?
            elem.innerHTML += '<div>' + message + '</div>';
    },
    //create markup for range list
    //!!! I know! markup mixed in with logic.... I know! I know...
    createRangeListMarkup: function() {
        var i, html, elem;
        var html = '';
        for(i=0; i<app.rangeBeacons.length; i++) {
            //I KNOW!...
            html += '<div class="row">' + "\n";
            html += '   <div id="rBeaconColor' + i + '" class="col col-color color-' + i + '"></div>' + "\n";
            html += '   <div id="rBeaconStar' + i + '" class="col col-star star-not"></div>' + "\n";
            html += '   <div id="rBeaconRange' + i + '" class="col col-range range-unknown"></div>' + "\n";
            html += '   <div id="rBeaconRangeLabel' + i + '" class="col col-range-label">SCANNING</div>' + "\n";
            html += '   <div id="rBeaconIdentifyer' + i + '" class="col col-identifier">' + app.rangeBeacons[i].identifier + '</div>' + "\n";
            html += '   <div id="rBeaconRSSI' + i + '" class="col col-rssi">----</div>' + "\n";         
            html += '</div>' + "\n";
        }

        //place it
        elem = document.getElementById('ranges');
        elem.innerHTML = html;
    }
    //handle location manager events for an iBeacon when monitoring if whithin proximity
    setMonitorDeligate: function() {
        var delegate = new cordova.plugins.locationManager.Delegate();
            
        delegate.didDetermineStateForRegion = function (pluginResult) {

            //app.logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

            cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('didStartMonitoringForRegion:', pluginResult);

            //app.logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            //app.logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
        };

        return delegate;
    },
    //handle location manager events for an iBeacon when monitoring distance from iBeacon
    setRangeDeligate: function() {
        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didDetermineStateForRegion = function (pluginResult) {

            app.logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

            cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('didStartMonitoringForRegion:', pluginResult);

            app.logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            app.logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
        };

        return delegate;
    },
    // Start monitoring if within proximity of iBeacons (with app running or not!)
    startMonitoringBeacons: function() {
        var i;
        var delegate = app.setMonitorDeligate();

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        //!!! might be nice to show a message about the "this app wishes to monitor you location"
        //explaining what how iBeacons will be used to enrich the experience before the user
        //things we are tracking them in their sleep...
        
        //if monitoring only when app is active
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        //OR if monitoring all the time:
        //cordova.plugins.locationManager.requestAlwaysAuthorization();

        for(i=0; i<app.monitorBeacons.length; i++) {
            //set iBeacon's region
            app.monitorBeacons[i].region = new cordova.plugins.locationManager.BeaconRegion(app.monitorBeacons[i].identifier, app.monitorBeacons[i].uuid, app.monitorBeacons[i].major, app.monitorBeacons[i].minor);

            //start monitoring the iBeacon!
            cordova.plugins.locationManager.startMonitoringForRegion(app.monitorBeacons[i].region)
                .fail(console.error)
                .done();
        }
    },
    // Start monitoring iBeacon ranges
    startRangingBeacons: function() {
        var i;
        var delegate = app.setRangeDeligate();

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        //!!! check if this is possible for ranging?: cordova.plugins.locationManager.requestAlwaysAuthorization();

        for(i=0; i<app.rangeBeacons.length; i++) {
            //set i for display update purposes for now (instead of "redrawing" everything for now)
            app.rangeBeacons[i].i = i;

            //set iBeacon's region
            app.rangeBeacons[i].region = new cordova.plugins.locationManager.BeaconRegion(app.rangeBeacons[i].identifier, app.rangeBeacons[i].uuid, app.rangeBeacons[i].major, app.rangeBeacons[i].minor);

            //start ranging the iBeacon!
            cordova.plugins.locationManager.startRangingBeaconsInRegion(app.rangeBeacons[i].region)
                .fail(console.error)
                .done();
        }
    },
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        try {
            app.createRangeListMarkup();
            app.startRangingBeacons();


            app.startMonitoringBeacons();
        
        } catch(err) {
            alert(err);
            //app.logToDom(err.message);
        }
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
