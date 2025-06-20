const apiBaseUrl = "http://localhost:8080";
let gridSize = 5;


function addCellFunctions(cell, row, col){
    cell.addEventListener('keydown', function(e) {
        //deleting goes to previous cell
        if (e.key === 'Backspace' || e.key === 'Delete') {
            if (this.value === '') {
                //if hit while empty go to previous cell
                if (col > 0) {
                    const prevCell = document.getElementById(`cell-${row}-${col-1}`);
                    if (prevCell) {
                        prevCell.focus();
                        prevCell.value = '';
                    }
                } else if (row > 0) {
                    const prevCell = document.getElementById(`cell-${row-1}-${gridSize-1}`);
                    if (prevCell) {
                        prevCell.focus();
                        prevCell.value = '';
                    }
                }
            } else {
                //clear cell
                this.value = '';
            }
            e.preventDefault();
            return;
        }
                        
        //change cell with arrows keys
        if (e.key === 'ArrowRight') {
            const nextCell = col < gridSize - 1 ? document.getElementById(`cell-${row}-${col+1}`) : null;
            if (nextCell) nextCell.focus();
        } 
        else if (e.key === 'ArrowLeft') {
            const prevCell = col > 0 ? document.getElementById(`cell-${row}-${col-1}`) : null;
            if (prevCell) prevCell.focus();
        } 
        else if (e.key === 'ArrowDown') {
            const belowCell = row < gridSize - 1 ? document.getElementById(`cell-${row+1}-${col}`) : null;
            if (belowCell) belowCell.focus();
        } 
        else if (e.key === 'ArrowUp') {
            const aboveCell = row > 0 ? document.getElementById(`cell-${row-1}-${col}`) : null;
            if (aboveCell) aboveCell.focus();
        }
                        
        //go to next cell after typing a character
        if (e.key.length === 1 && e.key.match(/[a-z0-9]/i)) {
            setTimeout(() => {
                let nextCell;
                if (col < gridSize - 1) {
                    nextCell = document.getElementById(`cell-${row}-${col+1}`);
                } else if (row < gridSize - 1) {
                    nextCell = document.getElementById(`cell-${row+1}-0`);
                } 
                                
                if (nextCell) {
                    nextCell.focus();
                }
            }, 10);
        }
    });
}
        
function generateGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'grid-cell';
            cell.id = `cell-${row}-${col}`;
    
            addCellFunctions(cell, row, col);
                    
            gridContainer.appendChild(cell);
        }
    }
            
    if (gridContainer.firstChild) {
        gridContainer.firstChild.focus();
    }
    
    const gridTitle = document.getElementById('grid-title');
    gridTitle.textContent = `${gridSize}x${gridSize} boggle grid`; 
}
         


function checkSizeAndGenerateGrid(){
    const sizeInput = document.getElementById('grid-size-input');
    const newSize = parseInt(sizeInput.value);

    if (newSize >= 4 && newSize <= 8) {
        gridSize = newSize;
        generateGrid();
    } else {
        alert('Please enter a number between 4 and 8');
        sizeInput.value = gridSize;
    }
}

function isLetter(char) {
  const code = char.charCodeAt(0);
  return (
    (code >= 65 && code <= 90) ||  // A-Z
    (code >= 97 && code <= 122)     // a-z
  );
}

//strings are immutable in js, we can maybe improve performance by creating an arraylist [] and adding (with push) and then using join at the end, just have to consider last string
//how to remove last space, time complexity of this is O(n^2) T_T
function getGridString(){
    let sentString = gridSize + "::";
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            let currentChar = cell.value;

            if(!currentChar || !isLetter(currentChar)){
                sentString += "fail";
            }

            sentString += currentChar + " ";
        }
    }
    sentString = sentString.slice(0, sentString.length - 1);
    return sentString;
}

function startSolving(){
    let sentString = getGridString();
    if(sentString.includes("fail")){
        alert("The boggle grid is not filled or is filled with non chars :(");
    }
    else{
        sendToBackend(sentString);
    }
    
}

async function sendToBackend(dataAsString) {
    const data = { input: dataAsString };

    try {
        const response = await fetch(`${apiBaseUrl}/solve-boggle-all-at-once`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), //sendinginfo
        });

        const result = await response.text(); // Extract result
        loadWordsInTextBox(result);
        console.log(result);
        return result; //return result, unnecessary here but we keep for fun

    } catch (error) {
        console.error("Error:", error);
        throw error; //throw error if needed
    }
}

//this one in combo with the other part commented out would work on click, not on hover
// function loadWordsInTextBox(wordListString){
//     let wordList = getWordListFromString(wordListString);
//     let wordTextBox = document.getElementById("words-textbox");

//     wordTextBox.value = "";
//     for(let word of wordList){
//         wordTextBox.value += word + "\n";
//     }
// }

//will have to change this when sending path info
function getWordListFromString(wordListString){
    return wordListString.split(" ");
}

function getWordAtPosition(text, pos) {
    //finding boundaries of word
    let start = pos;
    let end = pos;

    while (start > 0 && isLetter(text[start - 1])) start--;
    while (end < text.length && isLetter(text[end])) end++;

    return text.substring(start, end);
}


//this one works with hover and click
function loadWordsInTextBox(wordListString) {
    let wordList = getWordListFromString(wordListString);
    let wordTextBox = document.getElementById("words-textbox");
    
    //clear box
    wordTextBox.innerHTML = "";
    
    //add each word on a new line as div so clickable and with and click functionality
    wordList.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.classList.add('word-item');
        
        // Click event to show the word in an alert
        wordElement.addEventListener('click', function() {
            alert("Clicked word: " + word);
        });
        
        wordTextBox.appendChild(wordElement);
    });

    //add hover functionality to word divs
    wordTextBox.addEventListener('mousemove', (e) => {
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (!range) return;
        
        const textNode = range.startContainer;
        const text = textNode.textContent;
        const offset = range.startOffset;
        
        const word = getWordAtPosition(text, offset);
        document.getElementById("current-word").value = word;
    });
}

function getWordListFromString(wordListString) {
    return wordListString.split(" ");
}

function initialize(){
    const generateBtn = document.getElementById('generate-btn');
    const solveBtn = document.getElementById('solve-btn');
    let wordTextBox = document.getElementById("words-textbox");

    generateBtn.addEventListener('click', checkSizeAndGenerateGrid);

    solveBtn.addEventListener('click', startSolving);

    //works if click
    // wordTextBox.addEventListener('mousemove', (e) => {
    //     let currentWordHolder = document.getElementById("current-word")
    //     const text = wordTextBox.value;
    //     const cursorPos = wordTextBox.selectionStart; // Approximate position
    //     const word = getWordAtPosition(text, cursorPos);
    //     currentWordHolder.value = word;
    // });


    generateGrid();
}

initialize();
