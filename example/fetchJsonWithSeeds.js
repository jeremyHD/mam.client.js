const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://localhost:14265` })

var args = process.argv.slice(2)
var seedJSON = require('./Seeds.json')

// Initialise MAM State
let mamState = Mam.init(iota, seedJSON.seed[parseInt(args[0])])

let roots = [Mam.getFirstRoot(mamState)]

const execute = async addresses => {
    for (let address of addresses) {
        console.log('address: ', address)
        const resp = await Mam.fetch(address, 'public')
        for (var i = 0; i < resp.messages.length; i++) {
            console.log(iota.utils.fromTrytes(resp.messages[i]))
        }
        console.log('next root: ', resp.nextRoot)
    }
}

execute(roots)
