const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const address = "ec2-13-48-131-116.eu-north-1.compute.amazonaws.com";

const host = address;
const port = 41100;
const randomNumber = Math.floor(Math.random() * 50);
console.log("Looking for " + randomNumber);
let message = new Buffer.from('What ever');


const parseTick = (message) => {
    const parts = message.toString().split(',').map((part) => {
        return +part;
    });

    return {
        price: parts[0],
        time: parts[1]
    };
};

let latestTickTime = -1;

client.on('message', (message) => {
    const tick = parseTick(message);
    console.log('Price is', tick.price, ' not ', randomNumber);
    if (tick.price == randomNumber) {
        console.log("För dyrt");
        let message = new Buffer.from('5000');
        client.send(message, 0, message.length, port, host, (err, bytes) => {
            if (err) {
                console.log(err);
            }
            console.log('Message stop sent from: ' + client.address().port);
            client.close();
        });
    } else {
        if (tick.time > latestTickTime) {
            latestTickTime = tick.time;
        } else {
            console.log('Price is outdated, discard');
        }
    }
});

client.send(message, 0, message.length, port, host, (err, bytes) => {
    const address = client.address();
    if (err) {
        console.log(err);
    }
    console.log('Message sent from port: ' + address.port);
});