const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'http://192.168.0.110:14265' })

var args = process.argv.slice(2)
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota, seedJSON.seed[parseInt(args[0])], 1)
mamState.channel.count = 2
mamState.channel.next_count = 2


const publishWithIndex = async (index) => {
    if (args.length < 2) {
        console.error('argument amount error, (seed index in seedJSON) (channel index) (optional: next seed index)')
        return
    }
    let payloadJSON = {
        productID: 11451,
        productName: "ATOI",
        stage: index,
        timestamp: Date.now(),
        errorLog: ""
    }
    mamState.channel.start = index
    var message
    console.time('total message creation')
    if (args.length >= 3) {
        let mamState2 = Mam.init(iota, seedJSON.seed[parseInt(args[2])], 1)
        mamState2.channel.count = 2
        let nextRoot = Mam.createMerkleTree(mamState2)
        console.log('next root: ', nextRoot)
        message = Mam.createWithJson(mamState, payloadJSON, nextRoot)
    } else {
        message = Mam.createWithJson(mamState, payloadJSON)
    }
    console.timeEnd('total message creation')
    console.log('Message address: ', message.address)
    //console.time('attach')
    Mam.attach(message.payload, message.address, 4, 9)
    //console.timeEnd('attach')
}

publishWithIndex(parseInt(args[1]))

