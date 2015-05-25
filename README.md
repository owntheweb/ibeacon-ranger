[drafting docs now...]

#iBeacon Ranger

by [Christopher Stevens](http://www.christopherstevens.cc)

![iBeacon Ranger Screenshot](https://raw.githubusercontent.com/owntheweb/ibeacon-ranger/master/img/ibeacon-ranger-screen.png)

##What Is It?
iBeacon Ranger is an iBeacon diagnostic tool for iOS and Android built with PhoneGap and Adobe PhoneGap Build. Built on [Peter Metz](https://github.com/petermetz)'s [iBeacon Phonegap/Cordova plugin](https://github.com/petermetz/cordova-plugin-ibeacon), range and monitor a specified set of iBeacons in real-time. This app serves as an example of how to utilize iBeacons and as a starting point for creating your own PhoneGap iBeacon app.

##Why?
Well, because iBeacons are awesome. That's why. ;)

iBeacons are exciting, yet 'simple' low-energy Bluetooth (BLE) devices. They repeatedly shout out, "Here's my UUID, major version and minor version!", which in itself is not that exciting. Exciting possibilities happen when adding an app that can listen for their presence or determine their distance. Think self-guided tour, or a map that walks people though it (even inside buildings where GPS doesn't go). Trigger content by simply walking around with a mobile device. Awesome!

##Features
* Real-time scrolling line chart showcasing iBeacon RSSI (Received Signal Strength Indication)
* Range a list of iBeacons, categorize them as "immediate", "near", "far" or "unknown", and show their RSSI  in real-time
* The closest calculated iBeacon gets a star (great when thinking about triggering content associated with the closest beacon).
* Monitor a list of iBeacons, showing whether or not they are inside or outside of range (note: this is allowed to happen even when the app isn't running! - great for some use cases, annoying for others).
* Lots of scripty goodness to start building your own iBeacon app with. :D

##To-do
* Theoretically this app works on Android, but hasn't been tested there yet (anyone want to give it a shot?).
* Feature to manually add one's own iBeacons when the app is running (won't help anyone just scanning for my iBeacons!)

##Wish List
* Ability to scan ALL nearby iBeacons (currently not supported, see [this discussion](https://github.com/petermetz/cordova-plugin-ibeacon/issues/49) for details - prove me wrong!)

##Usage

First, make sure to set iBeacons to monitor in [js/BeaconMonitor.js](https://github.com/owntheweb/ibeacon-ranger/blob/master/js/BeaconMonitor.js)

###Adobe PhoneGap Build Usage

[Finish this...]

###PhoneGap Usage

[Finish this...]

##Tips for Your Success
* [Finish this...]

##Thank You

![Space Foundation](http://www.spacefoundation.org/m/vcards/images/sfLogo.png)

This app is co-sponsored by the [Space Foundation](http://www.spacefoundation.org).

In addition to personal time spent on this project, extra special thanks goes to the Space Foundation team, supplying iBeacon hardware and even a few on-the-clock training hours to dedicate towards iBeacon research. The Space Foundation is hoping to improve attendee navigational experiences at the annual [Space Symposium](http://www.spacesymposium.org) via a useful app map. We're also exploring options for potential use in the [Space Foundation Discovery Center](http://www.spacefoundation.org/museum). You too can help the Space Foundation achieve their mission to inspire, enable and propel, by contributing to this project. :D