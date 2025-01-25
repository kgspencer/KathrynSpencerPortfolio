'use strict';
(function() {

  let langLines = [];
  let rules = new Map(); // Map from a non-terminal string to an array of string expressions
  window.addEventListener('load', init);

  function init() {
    processLanguage();
    createRules();
    id("poemBtn").addEventListener("click", generatePoem);
  }

  /**
   * Called when the button is clicked for a new poem. Removes old poem from
   * display if it exists and displays a new one.
   * @param {object} evt - event object
   */
  function generatePoem(evt) {
    // Remove old poem from display
    let poem = id('poem');
    while (poem.firstChild) {
      poem.removeChild(poem.firstChild);
    }

    // Generate new poem and populate DOM
    let poemContent = writePoem();
    for (let i = 0; i < poemContent.length; i++) {
      let line = gen("p");
      line.textContent = poemContent[i];
      id("poem").appendChild(line);
    }
  }

  /**
   * Using the given language in Backus-Naur form, populate the map with
   * given rules.
   */
  function createRules() {
    let components = "";
    let rule = "";

    langLines.forEach((line) => {
      // Split non-terminal from expressions
      let terms = line.split("::=");
      rule = terms[0];

      // Throw exception if there are two of the same rule
      if (rules.has(rule)) {
        throw new Error("Invalid language: non-terminal copy found.");
      }

      let expressions = [];
      // Consider each possible expression and split into components
      terms[1].split("|").forEach((option) => {
        option.trim();
        // components = option.split("\\s+");
        expressions.push(option);
      })
      rules.set(rule, expressions);
    });
  }

  /**
   * Writes between 3 and 11 lines of a poem.
   * @returns {string[]} - poem lines
   */
  function writePoem() {
    let poemLines = [];
    let numLines = Math.floor(Math.random() * 9) + 3;
    for (let i = 0; i < numLines; i++) {
      poemLines.push(lineHelper("<sentence>"));
    }
    return poemLines;
  }

  /**
   * Recursively generates a line, following a trail of non-terminals until
   * it reaches a terminal.
   * @param {string} query - either terminal or non terminal
   * @returns {string} - completed line
   */
  function lineHelper(query) {
    let line = "";
    if (!rules.has(query)) {
      line += query + " ";
    } else {
      let numOptions = rules.get(query).length;
      let optionPosition = Math.floor(Math.random() * numOptions);
      let components = rules.get(query)[optionPosition].split(" ");

      for (let i = 0; i < components.length; i++) {
        line += lineHelper(components[i]);
      }
    }
    return line;
  }

  function processLanguage() {
    langLines.push("<sentence>::=<nounp> <verbp>|<pronoun> <intransverb> <conj> <nounp> <verbp>|<conj> <pronoun> <intransverb>|<posadj> <noun> <verbp>|<pronoun> <transverb> <posadj> <person>|<adj> <thing>|<presverb> <det> <thing>");
    langLines.push("<nounp>::=<det> <noun>|<det> <adj> <noun>");
    langLines.push("<adj>::=large|dead|wine-dark|golden|young|curt|brazen|rough|tired|sad|quiet|loud|warm|cold|lukewarm|small|clumsy|great|little|brave|blurry|hoarse|painful|gorgeous|tender|pitiful|beached");
    langLines.push("<det>::=the|a");
    langLines.push("<noun>::=<person>|<thing>|<animal>");
    langLines.push("<person>::=mother|father|son|daughter|child|boy|girl|painter|cousin|brother|sister");
    langLines.push("<thing>::=table|cup|straw|house|lake|river|night|knife|flower|plate|coin");
    langLines.push("<animal>::=dog|mare|horse|bull|ox|rabbit|fox|whale|fish");
    langLines.push("<verbp>::=<transverb> <nounp>|<intransverb>|<modal> <presverb>");
    langLines.push("<transverb>::=taught|honored|found|helped|caught|called|lost");
    langLines.push("<intransverb>::=died|collapsed|laughed|wept|straightened|jumped|laughed|whispered|fell|dreamt|burned|stood|awoke|ate|drank|ran|left|dreamed");
    langLines.push("<presverb>::=cry|fall|jump|lift|see|know|leave|push|pull|believe|rust|hurry|slip|laugh|count|march|feel|stand|watch|call");
    langLines.push("<modal>::=must|will|can|couldn't|may|can't");
    langLines.push("<pronoun>::=you|I|he|they|she|we");
    langLines.push("<conj>::=while|and|but|after|when|though");
    langLines.push("<posadj>::=your|his|my|her|our|their|the|a");
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