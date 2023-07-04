const sumRepeatingChars = (arr) => {
  const result = [];
  let memory = {};
  arr.forEach((c, i) => {
    if (memory[c]) memory[c] = memory[c]+1;
    else {
      Object.keys(memory).forEach((char) => result.push(`(${char})${memory[char]}`));
      memory = {[c]: 1}
    }
  })
  const lastChar = Object.keys(memory);
  if (lastChar.length) result.push(`(${lastChar[0]})${memory[lastChar[0]]}`);
  return result;
}

const isConsecutive = (prevIndexes, newIndex) => {
  const oldGap = prevIndexes[prevIndexes.length - 1] - prevIndexes[prevIndexes.length - 2];
  const newGap = newIndex - prevIndexes[prevIndexes.length - 1];
  return oldGap === newGap;
}

const condenseArray = (charsArray) => {
  const withoutRepeatingChars = sumRepeatingChars(charsArray);
  let loop = true;
  const iterateAndCondense = (arr) => {
    const res = [];
    const charsAt = {};
    arr.forEach((char, i) => {
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
      // if there is a mismatch or the instances of the pattern are not adjacent, empty indexes array and insert the newest one.
      // once the first iteration is over, go over each entry in the memory which have a sequences key.
      // for each sequence, create a template (better use different types of parentheses for ux, but that's for the future)
      // splice the result array in the sequences indexes, insert the template as a new char.
      // call this function again recursively, providing the result array. notice that this might work for repeating characters too.
      // if at the end of the loop, there are no sequences in the memory, it means that we are done. return the array.
      if(charsAt[char]) {
        const charLastIndex = charsAt[char].indexes[charsAt[char].indexes.length - 1]
        const gap = i - charLastIndex;
        const firstSeq = arr.slice(charLastIndex, gap).toString();
        const secondSeq = arr.slice(i, i + gap).toString();
        if(firstSeq === secondSeq) charsAt[char].indexes.push(i);
      } else {
        charsAt[char] = { indexes: [i] };
        res.push(char);
      }
    });
    Object.keys(charsAt).forEach((char) => res.splice(charsAt[char], 0, char));
    return res;
  }
  return iterateAndCondense(withoutRepeatingChars);
}

console.log(condenseArray('AAABBBAAABBBABABABABAAAABABABABAAAABABABAB'.split('')));