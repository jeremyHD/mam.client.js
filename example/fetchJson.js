const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'http://192.168.0.110:14265' })

var args = process.argv.slice(2)

// Initialise MAM State
let mamState = Mam.init(iota, Mam.keyGen(81), 1)

let root = args[0]

const execute = async address => {
    const resp = await Mam.fetch(address, 'public')
    for (var i = 0; i < resp.messages.length; i++) {
        let message = JSON.parse(iota.utils.fromTrytes(resp.messages[i]))
        console.log(message)
    }
    console.log('next root: ', resp.nextRoot)
}

execute(root)
