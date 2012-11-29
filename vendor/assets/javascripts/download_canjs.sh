#!/bin/bash

wget -N https://github.com/downloads/bitovi/canjs/can.jquery-1.1.2.js
wget -N https://github.com/downloads/bitovi/canjs/can.jquery-1.1.2.min.js
wget -N http://canjs.us/release/latest/can.construct.proxy.js
wget -N http://canjs.us/release/latest/can.construct.super.js
wget -N http://canjs.us/release/latest/can.observe.delegate.js
wget -N http://canjs.us/release/latest/can.observe.setter.js
wget -N http://canjs.us/release/latest/can.observe.attributes.js
wget -N http://canjs.us/release/latest/can.observe.validations.js
wget -N http://canjs.us/release/latest/can.observe.backup.js
wget -N http://canjs.us/release/latest/can.control.plugin.js
wget -N http://canjs.us/release/latest/can.control.view.js
wget -N http://canjs.us/release/latest/can.view.modifiers.js
wget -N http://canjs.us/release/latest/can.view.mustache.js
wget -N http://canjs.us/release/latest/can.fixture.js

# rename some files
mv can.jquery-*.min.js can.jquery.min.js
mv can.jquery-*.js can.jquery.js
