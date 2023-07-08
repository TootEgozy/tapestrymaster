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

const charObj = {
  ["char"]: {
    indexes: [0, 3, 6],
    sequences: [{
      chars: ["A", "B", "C"],
      startIndex: 0,
      endIndex: 6,
      repeat: 2
    }],
  }
}

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
const getSequencesFromMemory = (memory) => Object.keys(memory).filter((char) => memory[char].sequences).map((char) => memory[char].sequences).flat();

const isSegment = (s, smallSeqArr) => {
  let isSeq = true;
  for(let i = 0; i < s.length; i += smallSeqArr.length) {
    const segment = s.slice(i, i + smallSeqArr.length - 1);
    if(segment.toString() !== smallSeqArr.toString()) isSeq = false;
  }
  return isSeq;
}
// check if a given sequence is wrapping another sequence from the memory array. if so, it's invalid.
// for example: ACCCBDACCCBD is wrapping CCC,
// and therefore should be ignored now and condensed in the next recursion.
// ----------------------
// A problem: CC is wrapped in CCC, but in that case I want to choose the longer form.
// it's the same for ABABABAB, I want the whole seq and not just AB2.
// how can I differentiate between case ACCCBDACCCBD and case CCCC when my seq char is C?
// I need to use a for loop that jumps over (i += smallSeqArr.length) and find a segment that isn't equal, if I don't find one, it's not wrapping
const isWrappingSequence = (s, seq) => {
  const smallSeqArr = [];
  for(let i = 0; i < s.repeat; i++) smallSeqArr.push(...s.chars);
  if(isSegment(s, seq.chars)) return false;
  return !!seq.chars.toString().includes(smallSeqArr.toString());
}
// checks if 2 seq are the same but shifted. for example,
// the arr [A, B, A, B, A] can be reduced to [{A, B}2, A] but also to [A, {B, A}2]
// we need to pick one form to avoid duplications, so the first is favored.
const isShifted = (xStart, xLength, yStart, yLength) => (xStart >= yStart && xLength === yLength);

// skip this sequence if it's the same but shifted, or if it's wrapping a nested sequence.
const skip = (sequences, seq, i) => {
  const sequencesWithoutSeq = sequences.slice();
  sequencesWithoutSeq.splice(i, 1);
  const res = sequencesWithoutSeq.find((s) => {
      const isWrappingSeq = isWrappingSequence(s, seq);
      const isSameButShifted = isShifted(seq.startIndex, seq.chars.length, s.startIndex, s.chars.length);
      return isWrappingSeq || isSameButShifted;
  });
  return !!res;
};

// construct the new array with duplicate chars instead of found repeating chars
const createCondensedArray = (charsArr, sequences) => {
  // what if CCC is included in CCCCC?
  const newCharsArr = [...charsArr];
  sequences.forEach((seq, i) => {
    if(!skip(sequences, seq, i)) {
      let gap = seq.endIndex - seq.startIndex;
      if(seq.startIndex === 0) gap ++;
      const strSeq = seq.chars.toString();
      const template = `(${strSeq})${seq.repeat}`;
      newCharsArr.splice(seq.startIndex, gap + 1, template);
    }
  });
  return newCharsArr;
}

// getting the seq list and the new seq object, using the gap and index properties to determine if the seq continues another seq,
// if so, returns the matching seq from list.
const getOngoingSeq = (seqList, newSeq, i) => {
  if(!seqList) return;
  const ongoing =  seqList.find((s) => {
    const bool = newSeq.startIndex === s.endIndex;
    return bool;
  });
  return !!ongoing;
}

const condenseArray = (charsArr) => {
    const memory = {};
    charsArr.forEach((char, i) => {
      const charObj = memory[char];
      if(charObj) {
        const seq = getAdjSeq(charObj, charsArr, i);
        if (seq) {
          const ongoingSeq = getOngoingSeq(charObj.sequences, seq, i);
          if (ongoingSeq) updateDupSeq(ongoingSeq, seq);
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
    const sequences = getSequencesFromMemory(memory);
    if (!sequences.length) return charsArr.join(''); // if there are no new sequences, we are done
    return condenseArray(createCondensedArray(charsArr, sequences));
}

// const input = 'CDABABABADCHJIKLMLMC'.split('');
const input2 = 'GACDCCCACDCCCGHJ'.split('');
const input3 = 'GACDCjCjCjACDCjCjCjGHJ'.split('');
// first GACD(C)3ACD(C)3GHJ
// second and final G(ACD(C)3)GHI
// console.log(input2.toString());
const run = (input) => {
  console.log(input.toString());
  input.forEach((char, i) => console.log(`${i} ${char}`));
  const res = condenseArray(input);
  console.log(res);
}
run(input2);

