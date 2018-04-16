const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://140.112.28.112/iota` })

// Initialise MAM State
let mamState = Mam.init(iota)

const publishNext = async packet => {
    mamState = await Mam.updateChannelRoot(mamState)
    let packetTrytes = iota.utils.toTrytes(JSON.stringify(packet))
    let message = Mam.create(mamState, packetTrytes)

    await Mam.attach(message.payload, message.address)

    let firstRoot = Mam.getFirstRoot(mamState)
    var resp = await Mam.fetch(firstRoot, 'public')
    for (var msg in resp.messages) {
        console.log(iota.utils.fromTrytes(msg))
    }
}

const payloadJSON =
    {
        id: 100412,
        temp: 29.4,
        QA: "PASS",
        timestamp: Date.now()
    }

publishNext(payloadJSON)
