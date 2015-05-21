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
        navigator.notification.alert('logToDom: ' + message, function() { }, 'logToDom', 'Done');
        var element = document.getElementById('heading');
            element.innerHTML = message;
    },
    /*
    //handle location manager events for an iBeacon
    setMonitorDeligate: function() {
        var delegate = new cordova.plugins.locationManager.Delegate();
            
        delegate.didDetermineStateForRegion = function (pluginResult) {

            this.logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

            cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            console.log('didStartMonitoringForRegion:', pluginResult);

            this.logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            this.logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
        };;

        return delegate;
    },
    // Start monitoring if within proximity of iBeacons (with app running or not!)
    startMonitoringBeacons: function() {
        this.logToDom('test 2...');
        var i;
        var deligate = this.setMonitorDeligate();

        this.logToDom('test 3...');
        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        //!!! might be nice to show a message about the "this app wishes to monitor you location"
        //explaining what how iBeacons will be used to enrich the experience before the user
        //things we are tracking them in their sleep...
        this.logToDom('test 4...');
        cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
        // or cordova.plugins.locationManager.requestAlwaysAuthorization()

        for(i=0; i<this.monitorBeacons.length; i++) {
            //set iBeacon's region
            this.logToDom('test 5...');
            this.monitorBeacons[i].region = new cordova.plugins.locationManager.BeaconRegion(this.monitorBeacons[i].identifier, this.monitorBeacons[i].uuid, this.monitorBeacons[i].major, this.monitorBeacons[i].minor);

            //start monitoring the iBeacon!
            this.logToDom('test 6...');
            cordova.plugins.locationManager.startMonitoringForRegion(this.monitorBeacons[i].region)
                .fail(console.error)
                .done();
        }
    },
    */
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
            navigator.notification.alert('Test 1', function() { }, 'Testing', 'Done');
            this.logToDom('test 2');
            navigator.notification.alert('Test 3', function() { }, 'Testing', 'Done');
            //this.startMonitoringBeacons();
            

            /*
            var delegate = new cordova.plugins.locationManager.Delegate();

            delegate.didDetermineStateForRegion = function (pluginResult) {

                this.logToDom('[DOM] didDetermineStateForRegion: ' + JSON.stringify(pluginResult));

                cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
                    + JSON.stringify(pluginResult));
            };

            delegate.didStartMonitoringForRegion = function (pluginResult) {
                console.log('didStartMonitoringForRegion:', pluginResult);

                this.logToDom('didStartMonitoringForRegion:' + JSON.stringify(pluginResult));
            };

            delegate.didRangeBeaconsInRegion = function (pluginResult) {
                this.logToDom('[DOM] didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult));
            };

            */
            
            /*
            cordova.plugins.locationManager.setDelegate(delegate);

            // required in iOS 8+
            cordova.plugins.locationManager.requestWhenInUseAuthorization(); 
            // or cordova.plugins.locationManager.requestAlwaysAuthorization()

            cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                .fail(console.error)
                .done();
            */
        
        } catch(err) {
            alert('hmm');
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
