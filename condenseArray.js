// receives an array of characters and two indexes of a character.
// checks if the chars between the indexes are identical to the following segment.
// if so, return the sequence chars and gap (length of the sequence)
// if not, returns undefined.
const findSequence = (arr, charLastIndex, i) => {
  const gap = i - charLastIndex;
  const firstSeq = arr.slice(charLastIndex, i);
  const secondSeq = arr.slice(i, i + gap);
  const found = firstSeq.toString() === secondSeq.toString();
  if (found)
    return {
      seq: firstSeq.toString(),
      gap,
    };
  else return undefined;
};

const createTemplate = (seq, repeat) => `(${seq})${repeat}`;

// receives chars array, a sequence, the sequence's last index and the length of the sequence.
// iterates over the array in jumps of sequence length, and counting the sequence repetitions.
// once the loop is done, or a mismatch is found, returns the sequence as a template and the repetitions count.
const getSequenceData = (arr, seq, seqPrevIndex, gap) => {
  const seqData = {
    repeats: 0,
    lastIndex: seqPrevIndex,
  };
  for (let i = seqPrevIndex; i < arr.length; i += gap) {
    const chars = arr.slice(seqData.lastIndex, i + gap);
    if (chars.toString() === seq) {
      seqData.repeats = seqData.repeats + 1;
      seqData.lastIndex = seqData.lastIndex + gap;
    } else {
      return {
        template: createTemplate(seq, seqData.repeats),
        removeCount: seqData.repeats * seq.split(",").length,
      };
    }
  }
  return {
    template: createTemplate(seq, seqData.repeats),
    removeCount: seqData.repeats * seq.split(",").length,
  };
};

// a recursive function that receives an array of characters, and returns a condensed version by replacing repeating
// characters and sequences with a single sequence and a count.
// for example, if 45 stitches of color A is required, the function will condense ["A", "A", "A"...] into "(A)45"
// the loop iterates over the given array, and whenever a sequence is found the array is spliced and the
// sequence is replaced with a condensed version of it.
// at the end of the loop, if any sequence is found, the function calls itself with the new array to further condense it.
// for example, ["A","(C)2","B","A","(C)2","B"] can still be condensed to "(A (C)2 B)2".
// if no new sequences found, the result array is returned.
const condenseArray = (charsArray) => {
  // convert to a while loop
  let sequencesFound = false;
  let memory = {};
  let charsArr = charsArray.slice();
  for (let i = 0; i < charsArr.length; i++) {
    const char = charsArr[i];
    if (`${char}` in memory) {
      const data = findSequence(charsArr, memory[char], i);
      if (data) {
        const sequenceData = getSequenceData(
          charsArr,
          data.seq,
          memory[char],
          data.gap
        );
        charsArr.splice(
          memory[char],
          sequenceData.removeCount,
          sequenceData.template
        );
        sequencesFound = true;
        i = memory[char];
        memory = {};
      } else {
        memory[char] = i;
      }
    } else {
      memory[char] = i;
    }
  }
  if (sequencesFound) return condenseArray(charsArr);
  return charsArr;
};

module.exports = { condenseArray };
