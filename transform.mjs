import { readFileSync } from "fs"

const text = readFileSync("cmudict-0.7b.txt").toString()
const lines = text.split("\n")

const word_to_phoneticsArr = {}

for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.slice(0,3)===";;;") {
        continue
    }

    const pos_doubleSpace = line.indexOf("  ")
    let word = line.slice(0,pos_doubleSpace)
    const phonetics = line.slice(pos_doubleSpace + 2)
    const groups = word.match(/\((.*?)\)$/)
    if (groups) {
        word = word.slice(0,groups.index)
        word_to_phoneticsArr[word].push(phonetics)
    } else {
        word_to_phoneticsArr[word] = [phonetics]
    }
}
// copy(JSON.stringify(word_to_phoneticsArr))
debugger