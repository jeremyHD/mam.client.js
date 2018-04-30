const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://140.112.28.112/iota` })

const channelSeedIndex = [
    [Mam.keyGen(81), 1],
    [Mam.keyGen(81), 1],
    [Mam.keyGen(81), 1],
    [Mam.keyGen(81), 1],
]

const seed = Mam.keyGen(81)

let mamState = Mam.init(iota, seed)

const mergeChannel = async channelSeeds => {
    let mergedChannelRoots = []
    for (let [channelSeed, index] of channelSeeds) {
        let subMamState = Mam.init(iota, channelSeed)
        mergedChannelRoots.push(Mam.getFirstRoot(subMamState))
        subMamState.channel.start = index
        let payload = {
            message: 'channel merged',
        }
        let message = Mam.createWithJson(subMamState, payload, Mam.getFirstRoot(mamState))
        await Mam.attach(message.payload, message.address, 4, 11)
    }


    let payload = {
        state: "OK",
        timestamp: Date.now(),
        mergedChannelRoots: mergedchannelRoots,
    }
    let message = Mam.createWithJson(mamState, payload)
    console.log('msg address: ', message.address)
    Mam.attach(message.payload, message.address, 4, 11)
}

mergeChannel(channelSeedIndex)
