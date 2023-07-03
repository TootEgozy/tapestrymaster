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

const condenseArray = (charsArray) => {
  const withoutRepeatingChars = sumRepeatingChars(charsArray);
  let loop = true;
  const iterateAndCondense = (arr) => {
    const res = [];
    const charsAt = {};
    arr.forEach((char, i) => {
      if(charsAt[char]) {
        const charLastIndex = charsAt[char].indexes[charsAt[char].indexes.length - 1]
        const gap = i - charLastIndex;
        const firstSeq = arr.slice(charLastIndex, gap).toString();
        const secondSeq = arr.slice(i, i + gap).toString();
        if(firstSeq === secondSeq) charsAt[char].indexes.push(i);
      } else {
        charsAt[char] = { indexes: [i] };
      }
    });
    Object.keys(charsAt).forEach((char) => res.splice(charsAt[char], 0, char));
    return res;
  }
  return iterateAndCondense(withoutRepeatingChars);
}

console.log(condenseArray('AAABBBAAABBBABABABABAAAABABABABAAAABABABAB'.split('')));