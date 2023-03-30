import { readFileSync } from 'fs'
import word_to_phoneticsArr from './transformed.json' assert {type:"json"}

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

async function main() {

    let alphabet_idx = 0
    const arpabetArr = []

    // a rhyme is defined as having at least 2 last sounds in common
    for (const word of ["art","night","rages","abed","arms","light","bread","charms","stages","wages","heart","apart","write","pages","dead","psalms","arms","ages","wages","art"]) {
        const phoneticsArr = word_to_phoneticsArr[word.toUpperCase()]
        if (!phoneticsArr) {
            throw "!phoneticsArr"
        }

        let rhymeSchemeLetter
        let deconstructedArr
        let rhymesWithWord

        outer:
        while (true) {
            for (let i = phoneticsArr.length - 1; i > -1; --i) {
                const chosenPhonetics = phoneticsArr[i]
                deconstructedArr = []
                let pos_space = chosenPhonetics.lastIndexOf(" ")
                while ((pos_space = chosenPhonetics.lastIndexOf(" ", pos_space - 1))>-1) {
                    deconstructedArr.push(chosenPhonetics.slice(pos_space+1))
                }
                deconstructedArr.push(chosenPhonetics)

                const founds = []
                for (const arpabet of arpabetArr) {
                    let j = 0
                    const max = Math.min(arpabet.deconstructedArr.length, deconstructedArr.length)
                    while (j < max && arpabet.deconstructedArr[j] === deconstructedArr[j]) {
                        ++j
                    }
                    if (j > 0) {
                        founds.push({rhymesWithWord:arpabet.word,rhymeSchemeLetter:arpabet.rhymeSchemeLetter,commonSoundsCount:j})
                    }
                }
                if (founds.length) {
                    let maxIdx = 0
                    for (let k = 1; k < founds.length; k++) {
                        if (founds[k].commonSoundsCount > founds[maxIdx].commonSoundsCount) {
                            maxIdx = k
                        }
                    }
                    rhymeSchemeLetter = founds[maxIdx].rhymeSchemeLetter
                    rhymesWithWord = founds[maxIdx].rhymesWithWord
                    break outer
                }
            }
            rhymeSchemeLetter = alphabet[alphabet_idx]
            ++alphabet_idx
            break
        }

        arpabetArr.push({word,deconstructedArr,rhymeSchemeLetter,rhymesWithWord})
    }

    const ok = arpabetArr.map(arpabet=>`${arpabet.word} ${arpabet.rhymeSchemeLetter}${arpabet.rhymesWithWord ? ` (${arpabet.rhymesWithWord})` : ""}`).join("\n")
    console.log(ok)
    debugger

}
main()