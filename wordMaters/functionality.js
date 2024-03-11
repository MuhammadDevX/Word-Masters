let input = '';
let counter = 1;
let counterForRow = 1;
const wordOfTheDay=getWord(WORD_URL);
document.getElementById('userInput').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    let inputWord = this.value.trim().toLowerCase();
    input = inputWord;
    if (/^[a-z]{5}$/.test(inputWord)) {
      displayWordAsBlocks(inputWord);
    } else {
      alert('Please enter a 5-letter word.');
    }
    this.value = ''; // Clear the input field
  }
});


function displayWordAsBlocks(inputWord) {
  const outputDiv = document.getElementsByClassName(`block-row${counterForRow}`)[0];
  outputDiv.innerHTML = ''; // Clear previous content
  counterForRow++;
  let localCounter=0;
  for (let char of inputWord) {
    const block = document.createElement('div');
    block.className = `block block${counter}`;
    block.textContent = char;
    counter++;
    localCounter++;
    checkCharacter(block.textContent,block,localCounter);
  }
  outputDiv.appendChild(block);
}

const WORD_URL = "https://words.dev-apis.com/word-of-the-day";

async function getWord(WORD_URL) {
  const promise = await fetch(WORD_URL);
  const processedPromise = await promise.json();
  const word = processedPromise.word;
  return word;
}

function checkCharacter(letter,block,localCounter) {
    if (wordOfTheDay[localCounter-1] ===letter ) {
      block.style.backgroundColor = 'green';
    }
}

// Example usage
// WORD_URL should be defined before calling getWord
// getWord(WORD_URL);



