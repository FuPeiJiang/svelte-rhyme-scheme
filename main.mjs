import { request } from 'https'

// https://forvo.com/word/${}/
async function main() {

    const ipaArr = []

    for (const word of ["art","night","rages","abed","arms","light","bread","charms","stages","wages","heart","apart","write","pages","dead","psalms","arms","ages","wages","art"]) {
        const ipa = await new Promise(resolve => {
            const toJoin = []
            const req = request({
                hostname: 'forvo.com',
                port: 443,
                path: `/word/${word}/`,
                method: 'GET',
                headers: {
                    "User-Agent": "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)"
                }
            }, (res) => {
                res.on('data', (data) => {
                    toJoin.push(data)
                })
                res.on('end', (event) => {
                    const lol = toJoin.join('')
                    try {
                        const ipa = lol.match(/<span class="phonetic">(.*?)<\/span>/)[1]
                        if (!ipa) {
                            debugger
                            throw 123
                        }
                        resolve(ipa)
                    } catch (error) {
                        debugger
                    }

                })
            })
            req.on('error', (e) => {
                console.error(e)
            })
            req.end()
        })
        ipaArr.push(ipa)
    }

    console.log(ipaArr)

}
main()