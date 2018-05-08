const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://localhost:14265` })

var args = process.argv.slice(2)

// Initialise MAM State
let mamState = Mam.init(iota)

let root = args[0]

const execute = async address => {
    const resp = await Mam.fetch(address, 'public')
    for (var i = 0; i < resp.messages.length; i++) {
        console.log(iota.utils.fromTrytes(resp.messages[i]))
    }
    console.log('next root: ', resp.nextRoot)
}

execute(root)
