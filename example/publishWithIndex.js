const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'http://192.168.0.110:14265' })
const emptyNextRoot = '999999999999999999999999999999999999999999999999999999999999999999999999999999999'
var args = process.argv.slice(2)
//var seedJSON = require('./Seeds.json')
const seedJSON = { seed: [Mam.keyGen(81), Mam.keyGen(81)] }

// Initialise MAM State
let mamState = Mam.init(iota, Mam.keyGen(81), 1)
mamState.channel.count = 2
mamState.channel.next_count = 2


const publishWithIndex = async (seed, channel_index, next_seed = null) => {
    let payloadJSON = {
        productID: 11451,
        productName: "ATOI",
        stage: channel_index,
        timestamp: Date.now(),
        errorLog: ""
    }
    mamState.seed = seed
    mamState.channel.start = channel_index
    var message
    //console.time('total message creation')
    if (next_seed) {
        let mamState2 = Mam.init(iota, next_seed, 1)
        mamState2.channel.count = 2
        let nextRoot = Mam.createMerkleTree(mamState2)
        console.log('next root: ', nextRoot)
        let componentRoot = Mam.getFirstRoot(mamState)
        message = Mam.createWithJson(mamState, payloadJSON, nextRoot)
    } else {
        message = Mam.createWithJson(mamState, payloadJSON)
    }
    //console.timeEnd('total message creation')
    //console.log('Message address: ', message.address)
    //console.log('Next message address: ', message.next_root)
    console.time('attach')
    Mam.attach(message.payload, message.address, 4, 9)
    console.timeEnd('attach')
}

const publishLast = async (seed, channel_index) => {
    mamState.seed = seed
    mamState.channel.start = channel_index
    let payloadJSON =
    {
        productID: 11451,
        productName: "ATOI",
        stage: channel_index,
        timestamp: Date.now(),
        errorLog: "",
        componentRoots:[
            Mam.getFirstRoot(mamState),
        ],
    }
    let message = Mam.createWithJson(mamState, payloadJSON, emptyNextRoot)
    console.log('Message address: ', message.address)
    Mam.attach(message.payload, message.address, 4, 9)
}

const publishMerge = async (seed, channelSeeds) => {
    mamState.seed = seed
    mamState.channel.start = 0
    let mergedChannelRoots = []
    let nextRoot = Mam.getFirstRoot(mamState)
    for (let [channelSeed, index] of channelSeeds) {
        let subMamState = Mam.init(iota, channelSeed, 1)
        subMamState.channel.count = 2
        mergedChannelRoots.push(Mam.getFirstRoot(subMamState))
    }

    let msgJson = {
        productID: 666,
        productName: "merged_product",
        stage: 0,
        timestamp: Date.now(),
        componentRoots:mergedChannelRoots
    }
    let message = Mam.createWithJson(mamState, msgJson)
    console.log('Message address: ', message.address)
    Mam.attach(message.payload, message.address, 4, 9)
}

publishWithIndex(Mam.keyGen(81), 0)
//publishLast(1, 4 + mamState.channel.count)
//publishMerge(1, [[Mam.keyGen(81), 0], [Mam.keyGen(81), 0], [Mam.keyGen(81), 0], [Mam.keyGen(81), 0]])
