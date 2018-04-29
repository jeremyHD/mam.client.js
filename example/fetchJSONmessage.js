const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://140.112.28.112/iota` })

let root = ''

// Initialise MAM State
let mamState = Mam.init(iota)

const execute = async () => {
    const resp = await Mam.fetch(root, 'public')
    for (var i = 0; i < resp.messages.length; i++) {
        console.log(iota.utils.fromTrytes(resp.messages[i]))
    }
}

execute()
