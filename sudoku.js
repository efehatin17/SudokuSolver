"use strict";

(function() {

  window.addEventListener("load", init);

  /** Initializes the state of the page. */
  function init() {
    id("solve").addEventListener("click", solve);
    id("clear").addEventListener("click", clear);
    let inputs = qsa("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", () => checkValidity(inputs[i]));
      inputs[i].addEventListener("focus", focus);
      inputs[i].addEventListener("blur", blur);
    }
  }

  /**
   * Checks the validity of the entered input in the Sudoku puzzle.
   * @param {object} input - DOM object (input)
   */
  function checkValidity(input) {
    let value = parseInt(input.value);
    let inputID = parseInt(input.id);
    if (isNaN(value) || value < 1) {
      input.value = "";
      input.classList.remove("clue");
    } else {
      input.classList.add("clue");
    }
    let row = checkRow(value, inputID);
    if (!row) {
      let errorRow = gen("p");
      errorRow.id = "duplicateInRow";
      errorRow.textContent = "Duplicate values entered in row " + calculateRow(inputID) + ".";
      errorRow.classList.add("error");
      id("errorColumn").appendChild(errorRow);
      for (let j = 1; j < 10; j++) {
        let convert = Math.floor(inputID / 10) * 10 + j;
        id(convert.toString()).parentNode.classList.add("err");
      }
    }
    let col = checkColumn(value, inputID);
    if (!col) {
      let errorCol = gen("p");
      errorCol.id = "duplicateInColumn";
      errorCol.textContent = "Duplicate values entered in column " + (inputID % 10) + ".";
      errorCol.classList.add("error");
      id("errorColumn").appendChild(errorCol);
      for (let j = 1; j < 10; j++) {
        let convert = j * 10 + inputID % 10;
        id(convert.toString()).parentNode.classList.add("err");
      }
    }
    let blk = checkBlock(value, inputID);
    if (!blk) {
      let errorBlk = gen("p");
      errorBlk.id = "duplicateInBlock";
      errorBlk.textContent = "Duplicate values entered in the highlighted block.";
      errorBlk.classList.add("error");
      id("errorColumn").appendChild(errorBlk);
      let blockPositionX = Math.floor((Math.floor(inputID / 10) - 1) / 3);
      let blockPositionY = Math.floor((inputID % 10 - 1) / 3);
      for (let k = 1; k < 4; k++) {
        for (let l = 1; l < 4; l++) {
          let convert = (blockPositionX * 3 + k) * 10 + blockPositionY * 3 + l;
          id(convert.toString()).parentNode.classList.add("err");
        }
      }
    }
    if (row && col && blk) {
      id(input.id).removeEventListener("blur", focus);
      for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
          let boxID = i * 10 + j;
          if (boxID !== inputID) {
            id(boxID.toString()).disabled = false;
          }
        }
      }
      let errs = qsa(".err");
      errs.forEach(element => element.classList.remove("err"));
      let errors = qsa(".error");
      errors.forEach(element => element.remove());
    } else {
      for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
          let boxID = i * 10 + j;
          if (boxID !== inputID) {
            id(boxID.toString()).disabled = true;
          }
        }
      }
      id(input.id).addEventListener("blur", focus);
      let error = gen("p");
      error.id = "boxesDisabled";
      error.classList.add("error");
      if ((!row && !col) || (!row && !blk) || (!col && !blk)) {
        error.textContent = "Please resolve the following errors before doing any changes on this Sudoku:";
      } else {
        error.textContent = "Please resolve the following error before doing any changes on this Sudoku:";
      }
      id("errorColumn").prepend(error);
    }
  }

  /**
   * Checks the validity of the entered value relative to the values in the same row.
   * @param {number} value - entered value
   * @param {number} inputID - id of the DOM object (input)
   */
  function checkRow(value, inputID) {
    for (let i = 1; i < 10; i++) {
      let otherID = Math.floor(inputID / 10) * 10 + i;
      let otherValue = parseInt(id(otherID.toString()).value);
      if (otherID !== inputID && otherValue === value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks the validity of the entered value relative to the values in the same column.
   * @param {number} value - entered value
   * @param {number} inputID - id of the DOM object (input)
   */
  function checkColumn(value, inputID) {
    for (let i = 1; i < 10; i++) {
      let otherID = i * 10 + inputID % 10;
      let otherValue = parseInt(id(otherID.toString()).value);
      if (otherID !== inputID && otherValue === value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks the validity of the entered value relative to the values in the same block.
   * @param {number} value - entered value
   * @param {number} inputID - id of the DOM object (input)
   */
  function checkBlock(value, inputID) {
    let row = Math.floor(inputID / 10);
    let column = inputID % 10;
    let blockPositionX = Math.floor((row - 1) / 3);
    let blockPositionY = Math.floor((column - 1) / 3);
    for (let i = 1; i < 4; i++) {
      for (let j = 1; j < 4; j++) {
        let otherID = (blockPositionX * 3 + i) * 10 + blockPositionY * 3 + j;
        if (otherID !== inputID && parseInt(id(otherID.toString()).value) === value) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Returns the assigned letter for the column of the given input.
   * @param {*} inputID - id of the DOM object (input)
   */
  function calculateRow(inputID) {
    let id = Math.floor(inputID / 10);
    if (id === 1) {
      return "A";
    } else if (id === 2) {
      return "B";
    } else if (id === 3) {
      return "C";
    } else if (id === 4) {
      return "D";
    } else if (id === 5) {
      return "E";
    } else if (id === 6) {
      return "F";
    } else if (id === 7) {
      return "G";
    } else if (id === 8) {
      return "H";
    } else {
      return "I";
    }
  }

  function focus(event) {
    let input = event.target;
    input.focus();
    let box = input.parentNode;
    box.classList.add("focus");
  }

  function blur(event) {
    let input = event.target;
    let box = input.parentNode;
    box.classList.remove("focus");
  }

  function solve() {
    if (id("tooFew") !== null) {
      id("tooFew").remove();
    }
    if (id("noPossibleSolution") !== null) {
      id("noPossibleSolution").remove();
    }
    let inputs = qsa("input");
    let nonEmpty = 0;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value !== "") {
        nonEmpty++;
      }
    }
    if (nonEmpty < 17) {
      let error = gen("p");
      error.id = "tooFew";
      error.classList.add("error");
      error.textContent = "A well-formed Sudoku needs to have at least 17 clues. You have only " +
                            "entered " + nonEmpty + ".";
      id("errorColumn").appendChild(error);
      return;
    }
    let array = new Array(9);
    for (let i = 0; i < 9; i++) {
      array[i] = new Array(9);
      for (let j = 0; j < 9; j++) {
        let curr = (i + 1) * 10 + j + 1;
        if (!id(curr.toString()).classList.contains("clue")) {
          array[i][j] = 0;
        } else {
          array[i][j] = parseInt(id(curr.toString()).value);
        }
      }
    }
    if (!recursiveSolve(array)) {
      let error = gen("p");
      error.id = "noPossibleSolution";
      error.classList.add("error");
      error.textContent = "This Sudoku does not have any possible solutions.";
      id("errorColumn").appendChild(error);
    } else {
      for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 10; j++) {
          let curr = i * 10 + j;
          if (!id(curr.toString()).classList.contains("clue")) {
            id(curr.toString()).value = array[i - 1][j - 1];
          }
          id(curr.toString()).disabled = true;
        }
      }
    }
  }

  function recursiveSolve(array) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (array[row][col] === 0) {
          for (let value = 1; value < 10; value++) {
            array[row][col] = value;
            if (isValid(array, row, col, value) && recursiveSolve(array)) {
              return true;
            }
            array[row][col] = 0;
          }
          return false;
        }
      }
    }
    return true;
  }

  function isValid(array, row, col, value) {
    for (let i = 0; i < 9; i++) {
      if (i !== col && array[row][i] === value) {
        return false;
      }
      if (i !== row && array[i][col] === value) {
        return false;
      }
    }
    let blockPositionX = Math.floor(row / 3);
    let blockPositionY = Math.floor(col / 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!(blockPositionX * 3 + i === row && blockPositionY * 3 + j === col)
            && array[blockPositionX * 3 + i][blockPositionY * 3 + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  /** Clears the Sudoku puzzle. */
  function clear() {
    for (let i = 1; i < 10; i++) {
      for (let j = 1; j < 10; j++) {
        let curr = i * 10 + j;
        id(curr.toString()).value = "";
        id(curr.toString()).disabled = false;
        id(curr.toString()).classList.remove("clue");
      }
    }
    let errors = qsa(".error");
    errors.forEach(element => element.remove());
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Checks the status of the response given by the API.
   * @param {object} res - response given by the API.
   */
  async function checkStatus(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

})();