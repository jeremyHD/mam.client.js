const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://localhost:14265` })

var args = process.argv.slice(2)
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota, seedJSON.seed[parseInt(args[0])])


const publishWithIndex = async (packet, index) => {
    mamState.channel.start = index
    let message = Mam.createWithJson(mamState, packet)

    Mam.attach(message.payload, message.address, 4, 11)
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

publishWithIndex(payloadJSON, parseInt(args[1]))
