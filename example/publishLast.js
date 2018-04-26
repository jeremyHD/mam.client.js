const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://140.112.28.112/iota` })

const nextRoot = '999999999999999999999999999999999999999999999999999999999999999999999999999999999'

// Initialise MAM State
let mamState = Mam.init(iota)

const publishLast = async () => {
    console.time("updateChannelRoot")
    mamState = await Mam.updateChannelRoot(mamState)
    console.timeEnd("updateChannelRoot")

    let payloadJSON =
    {
        id: 14501,
        temp: 29.4,
        QA: "PASS",
        timestamp: Date.now(),
        componentRoots:[
            Mam.getFirstRoot(mamState),
        ],
    }

    let packetTrytes = iota.utils.toTrytes(JSON.stringify(payloadJSON))
    let message = Mam.create(mamState, packetTrytes, nextRoot)

    console.log('Root: ', message.address)

    console.time("attach")
    Mam.attach(message.payload, message.address, 4, 11)
    console.timeEnd("attach")
}

publishLast()
