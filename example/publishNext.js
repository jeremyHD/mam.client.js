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
    Mam.attach(message.payload, message.address, 4, 11)
    console.timeEnd("attach")
}

const payloadJSON =
    {
        id: 14501,
        temp: 29.4,
        QA: "PASS",
        timestamp: Date.now(),
        message: 'non callback'
        componentRoots:[
            "FSDJIASJDOIJWDOPKPOKSOPKDWPOKA",
            "jaoiwjdiojowiajidjoijwaiodjoaj",
            "DLWOKOvNNDW!@EO)ODNJAOKWEOOAW",
            "OPEJJD@99d0sa0!SJIJDJWIE)IFFGG",
            "000000000000000000000000000000",
            "111111111111111111111111111111",
            "222222222222222222222222222222",
            "333333333333333333333333333333",
            "alotalotalotalotofdatadatadata",
            "NANANANANANNANANANANANANANNANA",
        ],
    }

publishNext(payloadJSON)
