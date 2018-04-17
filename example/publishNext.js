const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://140.112.28.112/iota` })

// Initialise MAM State
let mamState = Mam.init(iota)

const publishNext = async packet => {
    console.time("updateChannelRoot")
    mamState = await Mam.updateChannelRoot(mamState)
    console.timeEnd("updateChannelRoot")

    let packetTrytes = iota.utils.toTrytes(JSON.stringify(packet))
    let message = Mam.create(mamState, packetTrytes)

    console.time("attach")
    await Mam.attach(message.payload, message.address)
    console.timeEnd("attach")

    let firstRoot = Mam.getFirstRoot(mamState)
    console.time("fetch")
    var resp = await Mam.fetch(firstRoot, 'public')
    console.timeEnd("fetch")
    for (var i = 0; i < resp.messages.length; i++) {
        console.log(iota.utils.fromTrytes(resp.messages[i]))
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
