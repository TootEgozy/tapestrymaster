
const charObj = {
  ["char"]: {
    indexes: [0, 3],
    sequences: [{
      chars: ["char", "otherChar", "thirdChar"],
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
  const firstSeq = arr.slice(lastIndex, gap).toString();
  const secondSeq = arr.slice(i, i + gap).toString();
  if(firstSeq === secondSeq) {
    return({
      chars: secondSeq.split(','),
      startIndex: i,
      endIndex: i + gap,
      repeat: 2,
    });
  }
  return undefined;
}

const getSequencesFromMemory = (memory) => {
  // extract all sequences into an array
  // map the array and edit each sequences chars into the template you want to insert
  // (out of this scope) splice the original array, cut out the chars in start-end indexes and insert the template
  const result = [];
  Object.keys(memory).forEach((char) => {
    if(char.sequences) char.sequences.forEach((seq) => result.push(seq));
  });
  return result;

}

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
const condenseArray = (charsArr) => {
    const memory = {};
    charsArr.forEach((char, i) => {
      const charObj = memory[char];
      if(charObj) {
        charObj.indexes.push(i);
        const seq = getAdjSeq(charObj, charsArr, i);
        if (seq) {
          // see if there is already a seq. if so, update, if not - create
          const dupSeq = charObj.sequences.find((prevSeq) => prevSeq.chars.toString() === seq.chars.toString());
          if (dupSeq) {
            dupSeq.endIndex = seq.endIndex;
            dupSeq.repeat = dupSeq.repeat + 1;
          }
          else {
            charObj.sequences.push(seq);
          }
        }
      }
      memory[char] = { indexes: [i] };
    });
    const sequences = getSequencesFromMemory(memory);
    if (!sequences.length) return charsArr; // if there are no new sequences, we are done
    const newCharsArr = [...charsArr];
    sequences.forEach((seq) => {
      let gap = seq.endIndex - seq.startIndex;
      if(seq.startIndex === 0) gap ++;

      const strSeq = seq.chars.toString();
      const template = `(${strSeq})${seq.repeat}`;
      newCharsArr.splice(seq.startIndex, gap, template);
    });
    return condenseArray(newCharsArr);
}
// בעיה! מה עם תת רצפים?
// cut out the string based on the index of the char's last appearance
// match to see if it's a match the sequence with the char's previous instance (prev [0, 3] and the new is 6);
// if it's a match, check to see if the char already have a sequence like this with these indexes. if not, create an entry,
// if so, add the data to the char's sequence data - edit the finish index to the sequence last index.
// in any case, add the current index to char's appearances indexes.


// arr.forEach((char, i) => {
//   if(memory[char]) {
//     const charLastIndex = memory[char].indexes[memory[char].indexes.length - 1]
//     const gap = i - charLastIndex;
//     const firstSeq = arr.slice(charLastIndex, gap).toString();
//     const secondSeq = arr.slice(i, i + gap).toString();
//     if(firstSeq === secondSeq) memory[char].indexes.push(i);
//   } else {
//     memory[char] = { indexes: [i] };
//     result.push(char);
//   }
// });
// Object.keys(memory).forEach((char) => result.splice(memory[char], 0, char));

// console.log(condenseArray('AAABBBAAABBBABABABABAAAABABABABAAAABABABAB'.split('')));