import { readFileSync } from 'fs'

async function main() {

    const haystack = readFileSync("C:/Users/User/Downloads/cmudict-0.7b.txt").toString()
    const ipaArr = []

    for (const word of ["art","night","rages","abed","arms","light","bread","charms","stages","wages","heart","apart","write","pages","dead","psalms","arms","ages","wages","art"]) {
        const wow = haystack.match(new RegExp(`^${word}`, 'im'))
        ipaArr.push(wow)
    }

    console.log(ipaArr)

}
main()