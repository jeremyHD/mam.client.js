const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://192.168.0.110:14265` })

const nextRoot = '999999999999999999999999999999999999999999999999999999999999999999999999999999999'

var args = process.argv.slice(2)
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota, seedJSON.seed[parseInt(args[0])])


const publishLast = async (index) => {
    mamState.channel.start = index

    let payloadJSON =
    {
        productID: 11451,
        productName: "ATOI",
        stage: parseInt(args[1]),
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
