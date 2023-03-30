import { readFileSync, writeFileSync } from 'fs'
import * as my_lzma from "lzma"

const buf = readFileSync("src/routes/transformed.json")
my_lzma.compress(buf, 9, (result, error) => {
    if (error) {
        debugger
    }
    try {
        const typedArray = new Int8Array(result)
        writeFileSync("src/routes/transformed.lzma", typedArray)
    } catch (error) {
        debugger
    }
})
