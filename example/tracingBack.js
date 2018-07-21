const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'http://192.168.0.110:14265' })

var args = process.argv.slice(2)

// Initialise MAM State
let mamState = Mam.init(iota, Mam.keyGen(81), 1)

let root = args[0]

const execute = async address => {
    const resp = await Mam.fetchSingle(address, 'public')
    let message = JSON.parse(iota.utils.fromTrytes(resp['payload']))
    var componentRoots
    if (message["componentRoots"]) {
        componentRoots = message["componentRoots"]
    } else {
        componentRoots = []
        console.error('componentRoots not found!')
        return
    }
    var sourceRoots = new Set([])
    while (componentRoots.length != 0) {
        let backTraceRoot = componentRoots.shift()
        let rsp = await Mam.fetchSingle(backTraceRoot, 'public')
        let msg = JSON.parse(iota.utils.fromTrytes(rsp['payload']))
        if (msg["componentRoots"]) {
            componentRoots = componentRoots.concat(msg["componentRoots"])
        } else {
            sourceRoots.add(backTraceRoot)
        }
    }

    console.log('source roots: ', sourceRoots)
}

execute(root)
