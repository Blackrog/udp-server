const dgram = require('dgram');
const server = dgram.createSocket('udp4');
// const {
//     AsyncNedb
// } = require('nedb-async');
// // const Datastore = require("nedb");

// const db = new AsyncNedb('database.db');
// db.asyncLoadDatabase();


//Socket port
const host = '127.0.0.1';
const port = 41100;


//Client array with object in
let clients = [];
let clients_ports = [];
let portCheck = [];
let dyrt = false;


// async function getUsers() {
//     clients = await db.asyncFind({});
//     clients_ports = clients.forEach(port);
//     console.log(clients_ports);
//     return clients;
// }

// getUsers();

server.on('error', (err) => {
    console.log(err.stack);
    server.close();
});

server.on('message', (msg, rinfo) => {
        console.log(`Connected client at ${rinfo.address}:${rinfo.port}, ${msg}`);
        clients.push(rinfo);
        clients_ports.push(rinfo.port);
        // db.insert(rinfo, (err, newDoc) => {});
    if (msg == "5000") {
        portCheck = rinfo.port;
        removePort(portCheck);
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

setInterval(() => {
    console.log(countClients(clients) + " connected clients");

    if (dyrt == false) {

        clients.forEach((rinfo) => {
            const price = Math.floor(Math.random() * 1001);
            const time = Date.now();
            const data = new Buffer.from(price + ',' + time);
            server.send(data, 0, data.length, rinfo.port, rinfo.address, (err, bytes) => {
                // console.log("skickar till " + rinfo.port);
                if (err) {
                    console.log(err.stack);
                }
            });
        });
    }
}, 1000);

function removePort(prt) {
    console.log("Removing port!");
    console.log(prt, " from ports: ", clients_ports);

    console.log(clients);
    console.log("break");

    let item = prt;
    let index = clients_ports.indexOf(item);
    console.log(index);

    clients.splice(index, 1);
    clients_ports.splice(index, 1);
    console.log("These clients still unsolved");
    console.log(clients_ports);
    console.log(clients);
    return clients;
}

function countClients(obj) {
    let result = 0;
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            result++;
        }
    }
    return result;
}
server.bind(port, host);