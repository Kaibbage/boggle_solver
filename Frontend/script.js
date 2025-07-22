const apiBaseUrl = "http://localhost:8080";
let gridSize = 5;
let wordToPathMap = new Map();


//maybe add a button that will switch these to another very similar clone page
//where cell size is not a constant and we can allow more than 8 as max size to see if can get big words


function handleMultipleChars(event){
    const focusedElement = document.activeElement;
    const currentId = focusedElement.id;
    const match = currentId.match(/^cell-(\d)-(\d)$/);

    if(match){
        //go to next cell after typing a character
        let row = parseInt(match[1]);
        let col = parseInt(match[2]);
        

        if (event.key.length === 1 && event.key.match(/[a-z0-9]/i)) {
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

    }
}

function handleArrowKeys(event){
    const focusedElement = document.activeElement;
    const currentId = focusedElement.id;
    const match = currentId.match(/^cell-(\d)-(\d)$/);

    if(match){
        //change cell with arrows keys
        let row = parseInt(match[1]);
        let col = parseInt(match[2]);

        if (event.key === 'ArrowRight') {
            const nextCell = col < gridSize - 1 ? document.getElementById(`cell-${row}-${col+1}`) : null;
            if (nextCell) nextCell.focus();
        } 
        else if (event.key === 'ArrowLeft') {
            const prevCell = col > 0 ? document.getElementById(`cell-${row}-${col-1}`) : null;
            if (prevCell) prevCell.focus();
        } 
        else if (event.key === 'ArrowDown') {
            const belowCell = row < gridSize - 1 ? document.getElementById(`cell-${row+1}-${col}`) : null;
            if (belowCell) belowCell.focus();
        } 
        else if (event.key === 'ArrowUp') {
            const aboveCell = row > 0 ? document.getElementById(`cell-${row-1}-${col}`) : null;
            if (aboveCell) aboveCell.focus();
        }
    }
}

function handleDeleteBackspace(event){
    const focusedElement = document.activeElement;
    const currentId = focusedElement.id;
    const match = currentId.match(/^cell-(\d)-(\d)$/);

    if(match){
        //deleting goes to previous cell
        let row = parseInt(match[1]);
        let col = parseInt(match[2]);
        
        if (focusedElement.value === '') {
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
            focusedElement.value = '';
        }
        event.preventDefault();

        let wordTextBox = document.getElementById("words-textbox");
        wordTextBox.innerHTML = "";

        return;
    }
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
                    
            gridContainer.appendChild(cell);
        }
    }
            
    if (gridContainer.firstChild) {
        gridContainer.firstChild.focus();
    }
    
    const gridTitle = document.getElementById('grid-title');
    gridTitle.textContent = `${gridSize}x${gridSize} boggle grid`;

    let wordTextBox = document.getElementById("words-textbox");
    wordTextBox.innerHTML = "";
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
        sendSolveToBackend(sentString);
    }
    
}

async function sendSolveToBackend(dataAsString) {
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
        loadWords(result);
        console.log(result);
        return result; //return result, unnecessary here but we keep for fun

    } catch (error) {
        console.error("Error:", error);
        throw error; //throw error if needed
    }
}

//will have to change this when sending path info
function getWordListFromString(wordPathListString){
    let wordListString = wordPathListString.split("::")[0];
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
function loadWords(wordPathListString) {
    let wordList = getWordListFromString(wordPathListString);
    let pathList = getPathListFromString(wordPathListString);

    setUpWordPathMap(wordList, pathList);

    let wordTextBox = document.getElementById("words-textbox");
    let currentWordInput = document.getElementById("current-word");
    
    wordTextBox.innerHTML = "";
    currentWordInput.value = "";

    console.log(wordList.length);
    
    //each word added as div so clickable and can do stuff with
    wordList.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.textContent = word;
        wordElement.classList.add('word-item');
        
        wordElement.addEventListener('click', function() {
            gradualLoadPathGreen(word);
        });

        wordElement.addEventListener('mouseenter', function() {
            currentWordInput.value = word;
            loadPathGreen(word);
            lookupWord(word);
        });

        wordElement.addEventListener('mouseleave', function() {
            currentWordInput.value = "";
            setBackWhite();
        });
        
        wordTextBox.appendChild(wordElement);
    });
}

async function lookupWord(word) {
    const definitionBox = document.getElementById("word-definition");

    if(!word){
        definitionBox.value = "Please enter a word.";
        return;
    }

    try{
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if(!response.ok){
            throw new Error("Word not found");
        }

        const data = await response.json();

        const meanings = data[0].meanings.map(meaning => {
            const defs = meaning.definitions.map(def => `- ${def.definition}`).join('\n');
            return `${meaning.partOfSpeech}:\n${defs}`;
        }).join('\n\n');

        definitionBox.textContent = `Definitions for "${word}":\n\n${meanings}`;
    }
    catch (error){
        definitionBox.textContent = `Error: ${error.message}`;
    } 
}


function setBackWhite(){
    for(let r = 0; r < gridSize; r++){
        for(let c = 0; c < gridSize; c++){
            let cell = document.getElementById(`cell-${r}-${c}`);
            cell.classList.remove("green");
            cell.classList.add("white");
        }
    }
}

function loadPathGreen(word){
    let path = wordToPathMap.get(word);

    for(let coord of path){
        let r = coord[0];
        let c = coord[1];

        let cell = document.getElementById(`cell-${r}-${c}`);
        cell.classList.remove("white");
        cell.classList.add("green");
    }
}

function gradualLoadPathGreen(word){
    let path = wordToPathMap.get(word);

    //set all white since will be green
    for(let coord of path){
        let r = coord[0];
        let c = coord[1];

        let cell = document.getElementById(`cell-${r}-${c}`);
        cell.classList.remove("green");
        cell.classList.add("white");
    }

    //gradually set back to green
    let delay = 100;
    for(let coord of path){
        let r = coord[0];
        let c = coord[1];

        let cell = document.getElementById(`cell-${r}-${c}`);

        setTimeout(() => {
            cell.classList.remove("white");
            cell.classList.add("green");
        }, delay);

        delay += 300
    }
}

function setUpWordPathMap(allWords, allPaths){
    for(let i = 0; i < allWords.length; i++){
        wordToPathMap.set(allWords[i], allPaths[i]);
    }
}

function getPathListFromString(wordPathListString){
    let pathListAsString = wordPathListString.split("::")[1];

    let pathListAsListOfStrings = pathListAsString.split("$");

    let index = 0;
    let allPaths = [];
    for(let pathString of pathListAsListOfStrings){

        let path = [];
        let pathCoordStringList = pathString.split("|");

        for(let pathCoordString of pathCoordStringList){
            let pathCoords = pathCoordString.split(" ");
            let r = parseInt(pathCoords[0]);
            let c = parseInt(pathCoords[1]);

            let coord = new Array(r, c);
            path.push(coord);

        }
        allPaths.push(path);

    }

    return allPaths;
}

async function generateRandomBoggle(){
    let n = gridSize;
    let stringN = n.toString();

    let gridString = await getRandomBoggleFromBackend(stringN);
    setGrid(n, gridString);

    let wordTextBox = document.getElementById("words-textbox");
    wordTextBox.innerHTML = "";

}

function setGrid(n, gridString){
    console.log(gridString);
    let chars = gridString.split(" ");

    let counter = 0;
    for(let c of chars){
        let row = Math.floor(counter / n);
        let col = counter % n;

        let cell = document.getElementById(`cell-${row}-${col}`);
        cell.value = c;

        counter++;
    }
}

async function getRandomBoggleFromBackend(dataAsString) {
    const data = { input: dataAsString };

    try {
        const response = await fetch(`${apiBaseUrl}/generate-random-boggle-grid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), //sendinginfo
        });

        const result = await response.text(); // Extract result
        return result; 

    } catch (error) {
        console.error("Error:", error);
        throw error; //throw error if needed
    }
}

function initialize(){
    const resizeBtn = document.getElementById('resize-btn');
    const solveBtn = document.getElementById('solve-btn');
    const generateRandomBtn = document.getElementById("generate-random-btn");

    resizeBtn.addEventListener('click', checkSizeAndGenerateGrid);
    solveBtn.addEventListener('click', startSolving);
    generateRandomBtn.addEventListener('click', generateRandomBoggle);

    generateGrid();

    document.addEventListener('keydown', (event) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
            handleArrowKeys(event);
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            handleDeleteBackspace(event);
        } else if (event.key.length === 1 && event.key.match(/[a-z0-9]/i)){
            handleMultipleChars(event);
        }
    });
}

initialize();
