// this function is meant to be run multiple times on the array until there are no more duplicates.
// the idea is to find all adjacent sequences and once they are converted to special characters, run again and find upper sequences.
// for example, [(A)3, (B)1, (A)2, (B)1, (A)2, (A)3, (B)1, (A)2, (B)1, (A)2]
// will be first converted to [(A)3, {(B)1, (A)2}2, (A)3, {(B)1, (A)2}2]
// and on the next and final iteration to {(A)3, {(B)1, (A)2}2}2
// create a result array which is a duplicate of the given array.
// for every new char, create a key in memory
// save the chars indexes. whenever you reach the char again, check if the last sequence match the following one.
// check if there is another match to this sequence and also check if the repetitions are adjacent using isConsecutive.
// save info about the sequence - the repeating pattern, start and finish indexes, update if it's consecutive.
// if there is a mismatch or the instances of the pattern are not adjacent, empty indexes array and insert the newest one. // needless
// once the first iteration is over, go over each entry in the memory which have a sequences key.
// for each sequence, create a template (better use different types of parentheses for ux, but that's for the future)
// splice the result array in the sequences indexes, insert the template as a new char.
// call this function again recursively, providing the result array. notice that this might work for repeating characters too.
// if at the end of the loop, there are no sequences in the memory, it means that we are done. return the array.

// type sequenceObj = {
//   chars: string[]
//   startIndex: number
//   endIndex: number
//   repeat: number
// }
//
// type charObj = {
//     indexes?: number[],
//     sequences?: sequenceObj[]
// }
//
// type Memory = {
//   [char: string]: charObj
// }

// receives the char object, the array and current index.
// check to see if there are adjacent matching sequences, if so, returns the new seq obj. if not, returns undefined.
const getAdjSeq = (char, arr, i) => {
  const lastIndex = char.indexes[char.indexes.length - 1];
  const gap = i - lastIndex;
  const firstSeq = arr.slice(lastIndex, i);
  const secondSeq = arr.slice(i, i + gap);
  if(firstSeq.toString() === secondSeq.toString()) {
    return({
      chars: secondSeq,
      startIndex: lastIndex,
      endIndex: i + gap - 1,
      repeat: 2,
      gap,
    });
  }
  return undefined;
}

// if the char already has an adjacent duplicate sequence, update it
const updateDupSeq = (dupSeq, seq) => {
  dupSeq.endIndex = seq.endIndex;
  dupSeq.repeat = dupSeq.repeat + 1;
}

// creates an array of all sequences
const getSequencesFromMemory = (memory) => {
  return Object.keys(memory)
               .filter((char) => memory[char].sequences)
               .map((char) => memory[char].sequences)
              // @ts-ignore
               .flat();
}

// is [ABC] a segment of [ABCABCABC]? yes
// is it a segment of [ABCABCA]? no.
//
const isSegment = (testedSeq, someSeqChars) => {
  if((testedSeq.length % someSeqChars.length) !== 0) return false;
  for(let i = 0; i < testedSeq.length - someSeqChars.length - 1; i+= someSeqChars.length) {
    const slice = testedSeq.slice(i, i+someSeqChars.length);
    if(slice.toString() !== someSeqChars.toString()) return false;
  }
  return true;
}
// check if a given sequence is wrapping another sequence from the memory array. if so, it's invalid.
// for example: ACCCBDACCCBD is wrapping CCC,
// and therefore should be ignored now and condensed in the next recursion.
// if the wrapped seq is a segment of the larger seq (like CCC in CCCCC) CCCCC not wrapping.
const isWrappingSequence = (testedSeq, someSeq) => {
  if(testedSeq.length <= someSeq.length) return false;
  const someSeqChars = [];
  for(let i = 0; i < someSeq.repeat; i++) someSeqChars.push(...someSeq.chars);
  const isWrappedSeqASegment = isSegment(testedSeq.chars, someSeqChars);
  if(isWrappedSeqASegment) {
    return false;
  }
  return !!testedSeq.chars.toString().includes(someSeqChars.toString());
}

// const tester = { chars: ["C"], repeat: 3 };
// const wrappingSeq = { chars:  ["C", "C", "C", "A", "B"] };
// const notWrappingSeq = { chars:  ["C"], repeat: 6 };
// [wrappingSeq, notWrappingSeq].forEach((seq) => console.log(isWrappingSequence(seq, tester))); // true false
// const seq = {
//   "chars": ["A", "C", "D", "C", "C", "C"],
//   "startIndex": 1,
//   "endIndex": 12,
//   "repeat": 2,
//   "gap": 6
// }
// const someSeq = {
//   "chars": ["C"],
//   "startIndex": 10,
//   "endIndex": 12,
//   "repeat": 3,
//   "gap": 1
// }
//
// console.log("sequence: "+JSON.stringify(seq));
// console.log("is wrapped in seq?: "+JSON.stringify(someSeq));
// console.log(isWrappingSequence(seq, someSeq));

// checks if 2 seq are the same but shifted. for example,
// the arr [A, B, A, B, A] can be reduced to [{A, B}2, A] but also to [A, {B, A}2]
// we need to pick one form to avoid duplications, so the first is favored.
// TODO: this disqualified
const isShifted = (testedSeq, otherSeq) => {
  return (
      otherSeq.startIndex >= testedSeq.startIndex && otherSeq.startIndex <= testedSeq.endIndex
      && testedSeq.endIndex >= otherSeq.startIndex && testedSeq.endIndex <= otherSeq.startIndex
  )
  // (xStart >= yStart && xLength === yLength);
}

// skip this sequence if it's the same but shifted, or if it's wrapping a nested sequence.
const skip = (sequences, seq) => {
  const res = sequences.find((s) => {
    const isWrappingSeq = isWrappingSequence(s, seq);
    // const isSameButShifted = isShifted(seq.startIndex, seq.chars.length, s.startIndex, s.chars.length);
    const isSameButShifted = isShifted(seq, s);
    return isWrappingSeq || isSameButShifted;
  });
  return !!res;
};

const filterSequences = (sequences) => {
  if(sequences.length === 1) return sequences;
  const filtered = sequences.filter((s, i, allSequences) => {
    const sequencesWithoutSeq = allSequences.slice();
    sequencesWithoutSeq.splice(i, 1);
    return !skip(sequencesWithoutSeq, s); // skip or not
  });
  return filtered;
}

// construct the new array with duplicate chars instead of found repeating chars
const createCondensedArray = (charsArr, sequencesFromMemory) => {
  const newCharsArr = [...charsArr];
  const filteredSequences = filterSequences(sequencesFromMemory);
  let removedCounter = 0;

  filteredSequences.forEach((seq) => {
      let gap = seq.endIndex - seq.startIndex;
      if(seq.startIndex === 0) gap ++;
      const strSeq = seq.chars.toString();
      const template = `(${strSeq})${seq.repeat}`;
      const removed = newCharsArr.splice(seq.startIndex - removedCounter, gap + 1, template);
      removedCounter += removed.length - 1;
  });
  return newCharsArr;
}

// getting the seq list and the new seq object, using the gap and index properties to determine if the seq continues another seq,
// if so, returns the matching seq from list.
const getOngoingSeq = (seqList, newSeq) => {
  if(!seqList) return;
  const ongoing = seqList.find((s) => newSeq.startIndex === s.endIndex || newSeq.endIndex - newSeq.gap === s.endIndex);
  return ongoing;
}
// const seqList = [{
//   chars: ["C"],
//   startIndex: 0,
//   endIndex: 2,
//   repeat: 2,
//   gap: 1
// }];
// const newSeq = [{
//   chars: ["C"],
//   startIndex: 1,
//   endIndex: 3,
//   repeat: 2,
//   gap: 1
// }];
//
// console.log(getOngoingSeq(seqList, newSeq));

const constructMemory = (charsArr) => {
  const memory = {};
  charsArr.forEach((char, i) => {
    const charObj = memory[char];
    if(charObj) {
      const seq = getAdjSeq(charObj, charsArr, i);
      if (seq) {
        const ongoingSeq = getOngoingSeq(charObj.sequences, seq);
        if (ongoingSeq) {
          updateDupSeq(ongoingSeq, seq);
        }
        else {
          if (!charObj.sequences) charObj.sequences = [];
          charObj.sequences.push(seq);
        }
      }
      charObj.indexes.push(i);
    }
    else {
      memory[char] = { indexes: [i] };
    }
  });
  return memory;
}

const condenseArray = (charsArr) => {
    const memory = constructMemory(charsArr);
    const sequences = getSequencesFromMemory(memory);
    if (!sequences.length) return charsArr.join(''); // if there are no new sequences, we are done
    const condensed =  createCondensedArray(charsArr, sequences);
    console.log(condensed.toString());
    return condenseArray(condensed);
} // Add a max repeat = length of charArr so if we have an error it wont cause stack overflow

const input1 = 'GACDCCCACDCCCGHJ'.split('');
const input2 = 'ABABABA'.split('');
const input3 = 'SAGGGGGAS'.split('');
const input4 = 'ABABABVFABABABGVF'.split('');
const input5 = 'AB'.split('');
const input6 = 'CCCCCCCCAAACCCCCC'.split('');
const input7 = 'GACDCCCACDCCCGHJ'.split('');
const input8 = 'GACDCCCACDCCCGHJ'.split('');
const input9 = 'GACDCCCACDCCCGHJ'.split('');
const run = (input) => {
  console.log(input.toString());
  // input.forEach((char, i) => console.log(`${i} ${char}`));
  const res = condenseArray(input);
  console.log(res);
}
run(input6);

