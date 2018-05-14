const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://192.168.0.110:14265` })

var seedJSON = require('./Seeds.json')

const channelSeedIndex = [
    [seedJSON.seed[0], 0],
    [seedJSON.seed[1], 1],
    [seedJSON.seed[2], 1]
]

const seed = Mam.keyGen(81)

let mamState = Mam.init(iota, seed, 1)

const mergeChannel = async channelSeeds => {
    let mergedChannelRoots = []
    for (let [channelSeed, index] of channelSeeds) {
        let subMamState = Mam.init(iota, channelSeed, 1)
        mergedChannelRoots.push(Mam.getFirstRoot(subMamState))
        subMamState.channel.start = index
        let payload = {
            message: 'channel merged',
        }
        let message = Mam.createWithJson(subMamState, payload, Mam.getFirstRoot(mamState))
	await Mam.attach(message.payload, message.address, 4, 11)
    }
    
    let msgJson = {
	productID: 666,
	productName: "merged_product",
	stage: 0,
	timestamp: Date.now(),
	componentRoots:mergedChannelRoots
    }
    let message = Mam.createWithJson(mamState, msgJson)
    console.log('msg address: ', message.address)
    Mam.attach(message.payload, message.address, 4, 11)
}

mergeChannel(channelSeedIndex)
