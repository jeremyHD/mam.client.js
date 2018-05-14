const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://localhost:14265` })

const nextRoot = '999999999999999999999999999999999999999999999999999999999999999999999999999999999'

var args = process.argv.slice(2)
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota, seedJSON.seed[parseInt(args[0])], 1)


const publishLast = async (index) => {
    mamState.channel.start = index

    let payloadJSON =
    {
        productID: 11451,
        productName: "ATOI",
        stage: 1,
        tempC: 55.4,
        timestamp: Date.now(),
        errorLog: "",
        componentRoots:[
            Mam.getFirstRoot(mamState),
        ],
    }

    let message = Mam.createWithJson(mamState, payloadJSON, nextRoot)

    Mam.attach(message.payload, message.address, 4, 11)
}

publishLast(parseInt(args[1]))
