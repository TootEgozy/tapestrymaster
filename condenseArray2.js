// create a flag of the sequences found = false
// create a for loop to iterate over charsArr.
// save every new char to memory.
// if you hit the same char again, check if you have a sequence.
// if it's not, rewrite the char's index in memory to be the new index.
// if it's a sequence, check for how long does it reach. get the last index
// condense the sequence into a template.
// splice the original charsArr, insert the seq template instead of repeating seq
// clear memory
// change the sequencesFound flag to true
// continue iterating of the new charsArr from the same index.
// at the end of the loop, check if any sequences found? if so, call the function again with charsArr.
// if not, return charsArr.

const isSequence = (arr, charLastIndex, i) => {
    const gap = i - charLastIndex;
    const firstSeq = arr.slice(charLastIndex, i);
    const secondSeq = arr.slice(i, i + gap);
    const found = firstSeq.toString() === secondSeq.toString();
    if(found) return ({
        seq: firstSeq.toString(),
        gap,
    });
}

const createTemplate = (seq, repeat) =>  `${seq}${repeat}`;

// define a repeat counter = 1; and a lastIndex prop
// create a for loop which iterates over arr in jumps of gap.
// if there is a match in the seq, add 1 to the repeat counter
// if there is a mismatch: create a template, return seq lastindex and template
const getSequenceData = (arr, charLastIndex, gap) => {

}


const condenseArray = (charsArray) => {
    let sequencesFound = false;
    let memory = {};
    let charsArr = charsArray.slice();
    for(let i = 0; i < charsArr; i++) {
        const char = charsArr[i];
        if(memory[char]) {
            const isSequence = isSequence(memory[char], charsArr, i);
            if(isSequence) {
                const sequenceData = 'getSequenceData'; //template, repeats, last index
                charsArr.splice(memory[char], sequenceData.lastIndex, sequenceData.template);
                sequencesFound = true;
                memory = {};
            }
            // if not, update memory:
            memory[char] = i;
        } else {
            memory[char] = i;
        }
    }
}

const createInstructions = (charsArr) => {
    const instructions = []
    return instructions;
}

const inputsOutputsForFlow = [
    ["AAACCCAC", "(A)3,(C)3AC"],
    ["ABCABCABC", "(ABC)3"],
    ["CABCABCABC", "(CAB)3C"],
    ["CCABCABC", "(C)2(ABC)2"]
];