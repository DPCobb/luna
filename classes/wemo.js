class Wemo
{
    constructor(targetDevice, targetState)
    {
        this.device = targetDevice
        this.state = targetState
    }

    light()
    {
        const Wemo = require('wemo-client');
        let wemo = new Wemo()
        let device = this.device.toLowerCase()
        let state = this.state
        wemo.discover(function(err, deviceInfo) {
            console.log('Wemo Device Found: %j', deviceInfo);
            var client = wemo.client(deviceInfo);
            client.on('error', function(err) {
                console.log('Error: %s', err.code);
            });

            // Handle BinaryState events
            client.on('binaryState', function(value) {
                console.log('Binary State changed to: %s', value);
            });
            switch(deviceInfo.friendlyName.toLowerCase()){
                case device:
                if(state == 'on'){
                    client.setBinaryState(1);
                    break
                }
                else{
                    client.setBinaryState(0);
                    break
                }
            }

        });

    }
}

module.exports = Wemo;
