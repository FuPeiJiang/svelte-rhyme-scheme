<svelte:head>
    <title>svelte-rhyme-scheme</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap" rel="stylesheet">

    <script>
        "undefined"==typeof Worker||"undefined"!=typeof location&&"file:"===location.protocol?"undefined"!=typeof global&&"undefined"!=typeof require?this.LZMA=function(n){return require(n||"./lzma-d-min.js").LZMA}:"undefined"!=typeof window&&window.document?!function(){function n(n){var o;return t(n),o={compress:function(n,t,r,i){e.LZMA_WORKER?e.LZMA_WORKER.compress(n,t,r,i):setTimeout(function(){o.compress(n,t,r,i)},50)},decompress:function(n,t,r){e.LZMA_WORKER?e.LZMA_WORKER.decompress(n,t,r):setTimeout(function(){o.decompress(n,t,r)},50)}}}var e,o=this,t=function(e){var t=document.createElement("script");t.type="text/javascript",t.src=e,t.onload=function(){o.LZMA=n},document.getElementsByTagName("head")[0].appendChild(t)};"undefined"!=typeof window?e=window:global&&(e=global),o.LZMA=n}():console.log("Can't load the worker. Sorry."):this.LZMA=function(n){var e=1,o=2,t=3,r={},i=new Worker(n||"./lzma-d-min.js");return i.onmessage=function(n){n.data.action===t?r[n.data.cbn]&&"function"==typeof r[n.data.cbn].on_progress&&r[n.data.cbn].on_progress(n.data.result):r[n.data.cbn]&&"function"==typeof r[n.data.cbn].on_finish&&(r[n.data.cbn].on_finish(n.data.result),delete r[n.data.cbn])},i.onerror=function(n){throw Error(n.message+" ("+n.filename+":"+n.lineno+")")},function(){function n(n,e,o,t,a){var c;do c=Math.floor(1e7*Math.random());while(void 0!==r[c]);r[c]={on_finish:t,on_progress:a},i.postMessage({action:n,cbn:c,W:e,mode:o})}return{compress:function(o,t,r,i){n(e,o,t,r,i)},decompress:function(e,t,r){n(o,e,!1,t,r)}}}()};
    </script>
    <!-- <script src="https://unpkg.com/lzma@2.1.8/src/lzma-min.js"></script> -->
    <!-- <script src="https://unpkg.com/lzma@2.1.8/src/lzma-d-min.js"></script> -->
</svelte:head>

<script>
    // import word_to_phoneticsArr  from "./transformed.json"
    import { onMount } from 'svelte';
    // import LZMA from 'lzma-web'
    // import { LZMA } from "lzma"
    // const my_lzma = new LZMA("../src/lzma_worker.js");
    // import my_lzma from "lzma"

    // import { readFileSync } from 'fs'

    // console.log(my_lzma)
    // my_lzma.compress(readFileSync("src/routes/transformed.json"), (result, error) => {
        // console.log(result, error)
    // })

    onMount(async () => {
        // const my_lzma = new LZMA("https://unpkg.com/lzma@2.1.8/src/lzma-d-min.js");
        const my_lzma = new LZMA();
        // const lzma = new LZMA();
        fetch("/transformed.lzma")
        .then(resp=>resp.arrayBuffer())
        .then(async arrayBuf=>{
            // const decompressed = await lzma.decompress(arrayBuf)
            // console.log(decompressed)


            const typedArray = new Int8Array(arrayBuf)
            // const normalArray = Array.from(typedArray)
            my_lzma.decompress(typedArray, (result, error) => {
                // console.log(result, error)
                word_to_phoneticsArr = JSON.parse(result)
            }, (percent)=>{
                console.log(percent)
            })
        })
        .catch(wow=>{
            debugger
        })
    });

    let textArea1Value
    let textArea2Value
    let word_to_phoneticsArr

    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    const anti_alphabet = {T:1,Z:1}


    function bruh1() {
        let alphabet_idx = 0
        const arpabetArr = []
        const words = Array.from(textArea1Value.matchAll(/([a-zA-Z']+)\S*?\s*?$/gm)).map(groups=>groups[1])
        for (const word of words) {
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
                    let pos_space = +Infinity
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
                        if (j > 0 && !anti_alphabet[arpabet.deconstructedArr[j-1]]) {
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

        textArea2Value = arpabetArr.map(arpabet=>`${arpabet.word} ${arpabet.rhymeSchemeLetter}${arpabet.rhymesWithWord ? ` (${arpabet.rhymesWithWord})` : ""}`).join("\n")
    }
    function keyDown1(event) {
        if (event.key === "Enter") {
            if (!event.shiftKey) {
                event.preventDefault()
                bruh1()
            }
        }
    }

</script>

<div style="display: flex; flex-direction: row;">
    <textarea on:paste={()=>setTimeout(bruh1,1)} on:keydown={keyDown1} bind:value={textArea1Value} rows="20" cols="40"></textarea>
    <button on:click={bruh1}>Button</button>
    {#if textArea2Value}
        <textarea bind:value={textArea2Value} rows="20"></textarea>
    {/if}
</div>

<style>
    * {
        font-family: 'Fira Code', monospace;
    }
</style>
