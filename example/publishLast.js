const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://192.168.0.110:14265` })

const nextRoot = '999999999999999999999999999999999999999999999999999999999999999999999999999999999'

var args = process.argv.slice(2)
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota, seedJSON.seed[parseInt(args[0])])
mamState.channel.count = 2


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

    console.time('total message creation')
    let message = Mam.createWithJson(mamState, payloadJSON, nextRoot)
    console.timeEnd('total message creation')
    console.log('Message address: ', message.address)
    console.time('attach')
    Mam.attach(message.payload, message.address, 4, 9)
    console.timeEnd('attach')
}

publishLast(parseInt(args[1]))
