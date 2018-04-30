const Mam = require('../lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: `http://140.112.28.112/iota` })

let roots = [
'DEYVFAWKHCBHRFLLJVGFDDTGRNVEGZYUI9VVWLCSQOGALLVGIUJOVIJCLEPFGZGRAMWUZURDUEUVNBUMG',
'LXEGJPLLRWPFRG9XTGVMUJMLNCTRYMEEYBSKDTAGRLMECOQRFUONEVYFQAHXANUOXXMSXFSKCBCJZXVBV',
'RJZVYLNIRUZASFPCBGLNBRYDKZWUDIFMHJRPVQKVDERMUXVVDMJZM9HJ9WLOKVJ9YFKRMHITVH9XDZYWG',
'MKOBYB9T9KSAPLMNZIQJQMWEDC9IXLNKVQCMZLEHVLVELDBNRYOZWCFEWQOCRCLQYDRA9JTGGYFPZXUYH',
'XZFXKFLATMVLBD9OJRECQBPHTSIMTPMAMRIDIISJEYIFTJMREKEW9DQBOUCOCJMUJLTHPFJNJNPIBBSCL',
]

// Initialise MAM State
let mamState = Mam.init(iota)

const execute = async addresses => {
    for (let address of addresses) {
        const resp = await Mam.fetch(address, 'public')
        for (var i = 0; i < resp.messages.length - 1; i++) {
            console.log(iota.utils.fromTrytes(resp.messages[i]))
        }
        console.log('next root: ', resp.nextRoot)
    }
}

execute(roots)
