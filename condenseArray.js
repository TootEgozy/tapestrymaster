const sumRepeatingChars = (arr) => {
  const result = [];
  let memory = {};
  arr.forEach((c) => {
    if (memory[c]) memory[c] = memory[c]+1; // {A: 2}
    else {
      Object.keys(memory).forEach((char) => result.push(`(${char})${memory[char]}`));
      memory = {[c]: 1}
    }
  })
  const lastChar = Object.keys(memory);
  if (lastChar.length) result.push(lastChar[0]);
  return result;
}

const condenseArray = (arr) => {
  // [A, A, B, A, A, B]
  // [[A, A], B, [A, A], B]
  // [[[A, A], B], [[A, A], B]]]
  // {(A)2, (B)1}2

  console.log(sumRepeatingChars('AABAAAAABABBB'.split('')));
}

condenseArray([]);