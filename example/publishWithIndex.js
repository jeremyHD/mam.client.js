const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://192.168.0.110:14265` })

var args = process.argv.slice(2)
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota, seedJSON.seed[parseInt(args[0])])


const publishWithIndex = async (index) => {
    let payloadJSON = {
        productID: 11451,
	productName: "ATOI",
	stage: index,
	timestamp: Date.now(),
	errorLog: ""
    }
    mamState.channel.start = index
    console.time('total message creation')
    let message = Mam.createWithJson(mamState, payloadJSON)
    console.timeEnd('total message creation')
    console.log('Message address: ', message.address)
    console.time('attach')
    Mam.attach(message.payload, message.address, 4, 11)
    console.timeEnd('attach')
}

publishWithIndex(parseInt(args[1]))

