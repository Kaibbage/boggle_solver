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

function getGridString(){
    let sentString = gridSize + "::";
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let cell = document.getElementById(`cell-${row}-${col}`);
            let currentChar = cell.value;

            sentString += currentChar + " ";
        }
    }
    sentString = sentString.slice(0, sentString.length - 1);
    return sentString;
}

function startSolving(){
    let sentString = getGridString();
    sendToBackend(sentString);
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
        console.log(result);
        return result; //return result, unnecessary here but we keep for fun

    } catch (error) {
        console.error("Error:", error);
        throw error; //throw error if needed
    }
}

function initialize(){
    const generateBtn = document.getElementById('generate-btn');
    const solveBtn = document.getElementById('solve-btn');

    generateBtn.addEventListener('click', checkSizeAndGenerateGrid);

    solveBtn.addEventListener('click', startSolving); //nothing yet lmao


    generateGrid();
}

initialize();
