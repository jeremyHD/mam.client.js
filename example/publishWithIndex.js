const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://localhost:14265` })
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota)

const publishWithIndex = async (packet, index) => {
    mamState.channel.start = index
    let message = Mam.createWithJson(mamState, packet)

    console.time("attach")
    Mam.attach(message.payload, message.address, 4, 11)
    console.timeEnd("attach")
}

const payloadJSON =
    {
        productID: 11451,
        productName: "ATOI",
        stage: 1,
        tempC: 55.4,
        timestamp: Date.now(),
        errorLog: ""
    }

console.time("publishWithIndex")
publishWithIndex(payloadJSON, 0)
console.timeEnd("publishWithIndex")
