'use strict';
(function() {
  const ALPHABETOG = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  let message = 'WHERE DOES THE KING OF ENGLAND KEEP HIS ARMIES? IN HIS SLEEVIES!';
  let keyboardLetter = '';
  let chosenLetter = '';
  let clickedLetter;

  window.addEventListener('load', init);

  /**
   * Initializes page behavior and event listeners.
   */
  function init() {
    id('howToBtn').addEventListener('click', howToScreen);
    id('gameBtn').addEventListener('click', playScreen);
    qs('h2').addEventListener('click', playScreen);
    id('testBtn').addEventListener('click', testAnswer);
    id('back').addEventListener('click', playScreen);
    let keyboardBtns = qsa('#keyboard button');
    for (let i = 0; i < keyboardBtns.length; i++) {
      keyboardBtns[i].addEventListener('click', typeLetter);
      keyboardBtns[i].addEventListener('click', swapLetters);
    }
    populateMessage();
  }

  /**
   * Displays game results.
   */
  function testAnswer() {
    id('selected').classList.add('hidden');
    id('keyboard').classList.add('hidden');
    id('testBtn').classList.add('hidden');
    id('results').classList.remove('hidden');
    id('back').classList.remove('hidden');
    if(isSolved()) {
      id('win').classList.remove('hidden');
      id('lose').classList.add('hidden');
    } else {
      id('lose').classList.remove('hidden');
      id('win').classList.add('hidden');
    }
  }

  /**
   * Determines whether or not the coded message has been solved.
   * @returns {boolean} - true if solved, false otherwise
   */
  function isSolved() {
    let solved = true;
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length - 1; i++) { // -1 accounts for extra space button at end
      if (msgBtns[i].textContent !== message.charAt(i)) {
        solved = false;
      }
    }
    return solved;
  }

  function howToScreen() {
    id('howTo').classList.remove('hidden');
    id('daily').classList.add('hidden');
    id('back').classList.add('hidden');
  }

  /**
   * Displays elements for the game screen.
   */
  function playScreen() {
    id('howTo').classList.add('hidden');
    id('daily').classList.remove('hidden');
    id('keyboard').classList.remove('hidden');
    id('testBtn').classList.remove('hidden');
    id('selected').classList.remove('hidden');
    id('results').classList.add('hidden');
  }

  /**
   * Returns an array with the shuffled alphabet.
   * @returns {array} - the shuffled alphabet
   */
  function shuffleAlphabet() {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let cardsLeft = alphabet.length;
    let rand;
    let temp;

    while (cardsLeft) {
      rand = Math.floor(Math.random() * --cardsLeft);
      temp = alphabet[cardsLeft];
      alphabet[cardsLeft] = alphabet[rand];
      alphabet[rand] = temp;
    }
    return alphabet;
  }

  /**
   * Adds coded message to the dom. Currently relies on a predefined scrambled alphabet.
   */
  function populateMessage() {
    let trialAlphabet = shuffleAlphabet();

    let crypto = id('cryptoQuip');
    let newAlphabet = ['O', 'P', 'B', 'J', 'L', 'N', 'I', 'X', 'T', 'A', 'C', 'Y', 'D', 'S', 'G', 'R', 'K', 'V', 'W', 'U', 'Z', 'M', 'H', 'Q', 'F', 'E'];

    let words = message.split(" ");
    for (let i = 0; i < words.length; i++) {
      let word = gen('div');
      for (let j = 0; j < words[i].length; j++) {
        let currChar = words[i].charAt(j);
        let msgBtn = gen('button');

        if (/[a-zA-Z]/.test(currChar)) {
          let swap = newAlphabet[ALPHABETOG.indexOf(currChar)];
          msgBtn.textContent = swap;
          msgBtn.setAttribute('id', swap);
          msgBtn.addEventListener('mouseover', highlightLetters);
          msgBtn.addEventListener('mouseout', delightLetters);
          msgBtn.addEventListener('click', handleClick);
        } else {
          msgBtn.textContent = currChar;
          msgBtn.setAttribute('id', currChar);
          msgBtn.disabled = true; // Disable any non-letter characters
        }
        word.appendChild(msgBtn);
      }
      let space = gen('button');
      space.disabled = true;
      space.id=' ';
      space.textContent = ' ';
      space.style.width = '25px';
      word.appendChild(space);
      crypto.appendChild(word)
    }
  }

  /**
   * Called when a message button is clicked. Handles game functionality depending
   * on the event target's current state.
   * @param {object} evt - current event object
   */
  function handleClick(evt) {
    // Use classes 'selected' and 'locked' to determine what to do
    clickedLetter = evt.currentTarget;
    if (clickedLetter.classList.contains('selected')) {
      chosenLetter = '';
    } else {
      chosenLetter = clickedLetter.textContent;
    }
    id('selected').textContent = 'Selected Letter: ' + chosenLetter;

    if (keyboardLetter.length !== 0) {
      swapLetters();
    } else {
      let msgBtns = qsa('#cryptoQuip button');
      if (!clickedLetter.classList.contains('selected')) {
        for (let i = 0; i < msgBtns.length; i++) {
          msgBtns[i].removeEventListener('mouseover', highlightLetters);
          msgBtns[i].removeEventListener('mouseout', delightLetters);
          if (clickedLetter.textContent === msgBtns[i].textContent && !clickedLetter.classList.contains('locked')
          && !msgBtns[i].classList.contains('locked')) {
            msgBtns[i].classList.add('selected');
            msgBtns[i].classList.add('bright');
          } else if (clickedLetter.textContent === msgBtns[i].textContent && clickedLetter.classList.contains('locked')
          && msgBtns[i].classList.contains('locked')){
            msgBtns[i].classList.add('selected');
          } else {
            msgBtns[i].classList.remove('selected');
            msgBtns[i].classList.remove('bright');
          }
        }
      } else if (clickedLetter.classList.contains('selected')) {
        for (let i = 0; i < msgBtns.length; i++) {
          msgBtns[i].classList.remove('bright');
          msgBtns[i].classList.remove('selected');
        }
        enableMouseovers();
      } else if (isLetterSelected && !clickedLetter.classList.contains('locked')) {
        for (let i = 0; i < msgBtns.length; i++) {
          msgBtns[i].classList.remove('selected');
          msgBtns[i].classList.remove('bright');
          if (msgBtns[i].textContent === clickedLetter.textContent) {
            msgBtns[i].classList.add('selected');
            msgBtns[i].classList.add('bright');
          }
        }
      }
      swapLetters();
    }
  }

  /**
   * Checks to see if any message letter is currently selected.
   * @returns {boolean} - true if letter is currently selected, false otherwise
   */
  function isLetterSelected() {
    let msgBtns = qsa('#cryptoQuip button');
    let lettersSelected = false;
    for (let i = 0; i < msgBtns.length; i++) {
      if (msgBtns[i].classList.contains('selected')) {
        lettersSelected = true;
      }
    }
    return lettersSelected;
  }

  /**
   * Swaps the clicked message letter with the clicked keyboard letter. Letters may
   * be clicked in either order (message or keyboard first).
   */
  function swapLetters() {
    if ((chosenLetter.length !== 0) && (keyboardLetter.length !== 0)) {

      let msgBtns = qsa('#cryptoQuip button');
      if (!alreadySwapped()) { // ensures that a letter is not swapped twice

        if (clickedLetter.classList.contains('locked')) { //if it's a locked letter,
          for (let i = 0; i < msgBtns.length; i++) {
            // only swap the locked letters
            if (msgBtns[i].textContent === chosenLetter && msgBtns[i].classList.contains('locked')) {
              msgBtns[i].textContent = keyboardLetter;
              msgBtns[i].setAttribute('id', keyboardLetter);
            }
          }
        } else {
          // only swap the unlocked letters, plus change appearance
          for (let i = 0; i < msgBtns.length; i++) {
            if (msgBtns[i].textContent === chosenLetter && !msgBtns[i].classList.contains('locked')) { // 2nd test should be unnecessary now
              msgBtns[i].classList.add('locked');
              msgBtns[i].classList.remove('selected');
              msgBtns[i].classList.remove('bright');
              msgBtns[i].textContent = keyboardLetter;
              msgBtns[i].setAttribute('id', keyboardLetter);
            }
          }
        }
      } else {
        for (let i = 0; i < msgBtns.length; i++) {
          if (msgBtns[i].textContent === chosenLetter) {
            msgBtns[i].classList.remove('selected');
            msgBtns[i].classList.remove('bright');
          }
        }
        id('error').classList.remove('hidden');
        id('selected').classList.add('hidden');
        id('clue').classList.add('hidden');
        setTimeout(() => {
          id('error').classList.add('hidden');
          id('selected').classList.remove('hidden');
          id('clue').classList.remove('hidden');
        }, 2000);
        console.log('That letter has already been swapped.');
      }

      chosenLetter = '';
      keyboardLetter = '';
      id('selected').textContent = 'Selected Letter: ' + chosenLetter;
      enableMouseovers();
    }
  }

  /**
   * Determines if a letter has already been swapped so that a letter isn't swapped more than once.
   * @returns {boolean} - true if letter has already been swapped, false otherwise
   */
  function alreadySwapped() {
    let swapped = false;
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length; i++) {
      if (msgBtns[i].textContent === keyboardLetter && msgBtns[i].classList.contains('locked')) {
        swapped = true;
      }
    }
    return swapped;
  }

  /**
   * Enables mouseovers for each message button
   */
  function enableMouseovers() {
    let msgBtns = qsa('#cryptoQuip button');

    for (let i = 0; i < msgBtns.length; i++) {
      msgBtns[i].addEventListener('mouseover', highlightLetters);
      msgBtns[i].addEventListener('mouseout', delightLetters);
    }
  }

  /**
   * Adds the bright class to all similar letters. Checks that letters are not locked.
   * @param {object} evt - current event object
   */
  function highlightLetters(evt) {
    let letter = evt.currentTarget;
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length; i++) {
      if (letter.textContent === msgBtns[i].textContent && !msgBtns[i].classList.contains('locked') &&
      !letter.classList.contains('locked') && letter.disabled == false) {
        msgBtns[i].classList.add('bright');
      }
    }
  }

  /**
   * Removes the bright class from all message buttons
   */
  function delightLetters() {
    let msgBtns = qsa('#cryptoQuip button');
    for (let i = 0; i < msgBtns.length; i++) {
      msgBtns[i].classList.remove('bright');
    }
  }

  /**
   * Sets keyboardLetter to the event target
   * @param {object} evt - current event object
   */
  function typeLetter(evt) {
    keyboardLetter = evt.currentTarget.textContent;
  }

  /* ********************************* HELPER FUNCTIONS ********************************* */

  /**
   * Searches document for an object with passed idName
   * @param {string} idName - string of id name
   * @returns {object} dom element with id name
   */
  function id(idName) {
    let element = document.getElementById(idName);
    return element;
  }

  /**
   * Searches document for the first objcet of type selector
   * @param {string} selector - string of tag name
   * @returns {object} dom element of type selector
   */
  function qs(selector) {
    let element = document.querySelector(selector);
    return element;
  }

  /**
   * Searches document for all elements of type selector
   * @param {string} querySelector - string of query selector
   * @returns {NodeList} - dom elements of type selector
   */
  function qsa(querySelector) {
    let element = document.querySelectorAll(querySelector);
    return element;
  }

  /**
   * Generate dom element of passed type
   * @param {string} htmlType - tag of element to be created
   * @returns {object} - the generated element
   */
  function gen(htmlType) {
    let element = document.createElement(htmlType);
    return element;
  }
})();