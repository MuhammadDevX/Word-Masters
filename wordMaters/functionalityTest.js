//!ALl of the constants and variables
let input = '';
let counterForRow = 1;
const WORD_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATION_URL="https://words.dev-apis.com/validate-word";
const loadingScreen= document.querySelector(".info-bar");
const page=document.querySelector(".page")
const winningDiv=document.querySelector(".WinningMessage")
const body=document.querySelector("body");
const ANSWER_LENGTH=5;
let done =false;
const ROUNDS=6;
//! Here we start handling the user input
document.getElementById('userInput').addEventListener('keyup', async function (event) {
  if(done){
    return;
  }
  if (event.key === 'Enter') {
    // Disable the input field to prevent further user input
    this.disabled = true;

    let inputWord = this.value.trim().toLowerCase();
    input = inputWord;
    //!The try catch has been used to check whether their is an error or not
    try {
      const isValidWord = await validateWord(VALIDATION_URL, inputWord);
      if ((/^[a-z]{5}$/.test(inputWord)) && isValidWord) {
        loadingScreen.classList.remove("hidden");
        const wordOfTheDay = await getWord(WORD_URL);

        const map=makeMap(wordOfTheDay);
        displayWordAsBlocks(inputWord, wordOfTheDay,map);

        // Check if the user guessed the correct word
        if (inputWord === wordOfTheDay) {
          page.classList.add("visibilityOff");
          winningDiv.classList.add("visibilityOn");
            // endGame(true);
          body.style.backgroundColor="grey";
        }
        if(done && input!= wordOfTheDay){
          alert("You lost");
          return;
      }
      } else if(!isValidWord) {
        alert('Incorrect word.');
      }else{
        alert("Enter a 5 - letter word");
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      // Re-enable the input field after the operations are completed
      this.disabled = false;
      loadingScreen.classList.add("hidden");
      this.value = ''; // Clear the input field
    }
  }
});

async function displayWordAsBlocks(inputWord, wordOfTheDay,object) {
  const outputDiv = document.getElementsByClassName(`block-row${counterForRow}`)[0];
  outputDiv.innerHTML = ''; // Clear previous content
  counterForRow++;
  let localCounter = 0;
  if(counterForRow===ROUNDS){
    done=true;
  }
  const lettersColoredYellow = new Set();
  for (let char of inputWord) {
    const block = document.createElement('div');
    block.className = `block block${localCounter + 1}`;
    block.textContent = char;
    localCounter++;
    checkCharacter(char, block, localCounter, wordOfTheDay, lettersColoredYellow,object);
    outputDiv.appendChild(block);
  }
}

async function getWord(WORD_URL) {
  const promise = await fetch(WORD_URL);
  const processedPromise = await promise.json();
  const word = processedPromise.word;
  return word;
}

function checkCharacter(letter, block, localCounter, wordOfTheDay, lettersColoredYellow,object) {
  const correctPosition = wordOfTheDay[localCounter - 1] === letter;

  if (correctPosition) {
    block.style.backgroundColor = 'green';
    object[letter]--;
    
  } else {
    const indexInWord = wordOfTheDay.indexOf(letter);
    const existence= object[letter]>0;
    if (indexInWord !== -1 && !lettersColoredYellow.has(letter)&& existence) {
      block.style.backgroundColor = 'yellow';
      lettersColoredYellow.add(letter);
    }
  }
}

// function endGame(isWinner) {
//   if (isWinner) {
//     alert('Congratulations! You guessed the correct word.');
//   } else {
//     alert('Game Over. You did not guess the correct word.');
//   }
// }
async function validateWord(VALIDATION_URL,word){
  const promise = await fetch(VALIDATION_URL,{
    method : "POST",
    body:JSON.stringify({"word":`${word}`})
  })
  const processedPromise =await promise.json();
  return processedPromise.validWord;
}

function makeMap(array) {
const obj ={};
  for(let i =0;i < ANSWER_LENGTH;i++ ){
    const letter = array[i] 
    if(obj[letter]){
      obj[letter]++;
    }
    else{
      obj[letter]=1;
    }
  }
  return obj;
}