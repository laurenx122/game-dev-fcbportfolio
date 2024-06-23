//Variables - are storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;

//These variables will be sued to monitor if the user already won in the
//value of 2048, 4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//Declaring variable used for touch input
let startX = 0;
let startY = 0;



function setGame(){	
	 board = [
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0],
	 	[0, 0, 0, 0]
	 ]
	// board = [
	// 	[32, 8, 4, 0],
 //        [4, 128, 64, 256],
 //        [8, 32, 16, 2],
 //        [16, 2, 256, 1024]
	// ]
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			let tile = document.createElement("div");
			//id per tile
			tile.id = r.toString() + "-" + c.toString();
			let num = board[r][c];
			//changes/updates the color or appearance of the tile
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo();
}

//This updates the appearance of the tile based on its number
function updateTile(tile, num){
    tile.innerText= "";
    tile.classList.value = "";

    tile.classList.add("tile");

    if(num > 0) {
        // This will display the number of the tile 
        tile.innerText = num.toString();
           
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

window.onload = function(){
	setGame();
}


//"e" means event
function handleSlide(e){
	console.log(e.code); //prints out the key being pressed

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}
		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}
		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}
		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}


	document.getElementById("score").innerText = score;
	

	setTimeout(() => {
		checkWin();
	}, 300);

	//checkWin();
	if(hasLost() == true){
		setTimeout(() => {
			alert("\nGAME OVER!\nYou have lost the game.\nGame will restart");
			restartGame();
			alert("Click any arrow key to restart. Thank you!");
		}, 100)
		//setTimeout is used to delay the execution of the code inside the arrow function
	}
}

//checking the keyboard of the user(what he/she pressed)
document.addEventListener("keydown", handleSlide);

//removes the zeroes from the row/col
// clear the zeroes in between to help the numbers merge
function filterZero(row){
	return row.filter(num => num != 0);
}

//slide function is the one merging the adjacent tiles once the filterzero do its job
function slide(row){
	row = filterZero(row);

	for(let i =0; i<row.length -1; i++){
		if(row[i] == row[i+1]){ //checks if a tile is equal to its adjacent tile
			row[i] *= 2; //merge if the same number ang tiles
			row[i + 1] = 0;

			//this adds the merged tile value to the score.
			score += row[i];
		}
	}

	row = filterZero(row);

	// Add zeroes on the back after merging
	while(row.length < columns){
		row.push(0);
	}

	return row;
}

function slideLeft(){

	for(let r = 0; r < rows; r++){
        let row = board[r];
        
        //Line for animation
        let originalRow = row.slice();

        row = slide(row);
        board[r] = row;
        
        //After merging, the position and the value of the tiles might change, thus it follows that the id
        //number, color of the tile must be changed.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());//id
            let num = board[r][c];//number of tile
            //updateTile(tile, num);// appearance of tile
        	
        	//Line for animation
        	//if the original tile is not equal to the current tile, let's apply animation
        	if(originalRow[c] !== num && num != 0){
        		tile.style.animation = "slide-from-right 0.3s"
            	
            	//removes animation class after the animation is complete
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 300)
        	}

        	updateTile(tile, num);
        }

    }
}

function slideRight(){
	for(let r = 0; r < rows; r++){
        let row = board[r];

        //Line for animation
        //This documents the original position of tiles before sliding
        let originalRow = row.slice();

        row.reverse();
        row = slide(row);
        row.reverse();

        board[r] = row;
        
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //id
            let num = board[r][c]; //number of tile
            
            //Line for animation
        	//if the original tile is not equal to the current tile, let's apply animation
        	if(originalRow[c] !== num && num != 0){
        		tile.style.animation = "slide-from-left 0.3s"
            	
            	//removes animation class after the animation is complete
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 300)
        	}

            updateTile(tile, num);// appearance of tile
        }
    }
}

function slideUp(){
	for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        //Line for animation
        //This documents the original position of tiles before sliding
        let originalCol = col.slice();

        col = slide(col);               

        //This will record the current position of tiles that have changed
        let changedIndices = [];
        for(let r = 0; r < rows; r++){
        	if(originalCol[r] !== col[r]){
        		changedIndices.push(r);
        	}
        }

        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //id
            let num = board[r][c]; //number of tile
            
            //Line for animation
        	//if the original tile is not equal to the current tile, let's apply animation
        	if(changedIndices.includes(r) && num != 0){
        		tile.style.animation = "slide-from-bottom 0.3s"
            	
            	//removes animation class after the animation is complete
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 300)
        	}
            updateTile(tile, num);// appearance of tile
        }
    }
}

function slideDown(){
	for(let c = 0; c < columns; c++){
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        
        //Line for animation
        //This documents the original position of tiles before sliding
        let originalCol = col.slice();

        col.reverse();
        col = slide(col);
        col.reverse();
        
        //This will record the current position of tiles that have changed
        let changedIndices = [];
        for(let r = 0; r < rows; r++){
        	if(originalCol[r] !== col[r]){
        		changedIndices.push(r);
        	}
        }


        for(let r = 0; r < rows; r++){
        	board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //id
            let num = board[r][c]; //number of tile
            
            //Line for animation
        	//if the original tile is not equal to the current tile, let's apply animation
        	if(changedIndices.includes(r) && num != 0){
        		tile.style.animation = "slide-from-top 0.3s"
            	
            	//removes animation class after the animation is complete
            	setTimeout(() => {
            		tile.style.animation = "";
            	}, 300)
        	}

            updateTile(tile, num);// appearance of tile
        }
    }
}

function hasEmptyTile(){
	//this loop within a loop checks all the cells/boxes
	for(let r = 0; r<rows; r++){
		for(let c = 0; c<columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}	
	}
	return false;
}

function setTwo(){
	if(hasEmptyTile() == false){
		return;
	}

	let found = false;

	while(found == false){

		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);
		//r,c for the coordinates
		//3,1
		//0,0

		if(board[r][c] == 0){
			//Generate new tile
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

//checks if the player wins and this will congratulate the player
function checkWin(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			if(board[r][c] == 2048 && is2048Exist == false){
				alert("\nCONGRATULATIONS!\nYou just won the 2048 game!");
				is2048Exist = true;
			}
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("\nYou are unstoppable at 4096!");
				is4096Exist = true;
			}
			else if(board[r][c] == 8192 && is8192Exist == false){
				alert("\nVICTORY! You have reached 8192! You are incredibly awesome x 8192!");
				is8192Exist = true;
			}
		}
	}
}

//will check if there is still an empty tile(meaning there is still apossible move) and it will also check if there is the same tile value adjacent

function hasLost(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			// This code will check if there is a tile that is equal to zero(meaning empty tile)
			if(board[r][c] === 0){
				return false;
			}

			const currentTile = board[r][c];

			//This code will check if there are two adjacent tiles.
			if( 
				//Checks current tile if it has possible merge to its upper tile or
				r > 0 && board[r-1][c] === currentTile ||
				
				//if the current tile has a possible merge to its lower tile
				r < rows - 1 && board[r + 1][c] === currentTile ||

				//Check currenttile if it has possible merge to its left or
				c > 0 && board[r][c-1] === currentTile ||
				c < columns - 1 && board[r][c+1] === currentTile
			){
				// if we found a adjacent tile with the same value as the current tile, false, the use has not lost
				return false;
			}
		}
	}
	//No empty tile and no possible moves left
	//meaning, the user has already lost
	return true;
}

function restartGame(){
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			board[r][c] = 0;
		}
	}
	score = 0;
	setTwo();
}

//This code will listen when we touch the screen and assigns the x and y coordinates of that touch or event
//Inputs the x coordiniate value to startX and y coordinate cvalue to startY
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

//for the touch move feature
document.addEventListener('touchmove', (e) => {
	//if touches the area outside the board/tiles, this will do nothing
	if(!e.target.className.includes("tile")){
		return;
	}
	//To disable scrolling feature.
	e.preventDefault(); //if there's no semicolon, it's still fine since javascript is not strict with it

}, {passive: false}) //Use passive property to make sure that the preventDefault() method will work

document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")){
		return;
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;
 
 	// Check if the horizontal swipe is greater in magnitude than the vertical swipe
	if (Math.abs(diffX) > Math.abs(diffY)) {
	    // Horizontal swipe
	    if (diffX > 0) {
	        slideLeft(); // Call a function for sliding left
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideRight(); // Call a function for sliding right
	        setTwo(); // Call a function named "setTwo"
	    }
	} 
	else {
	    // Vertical swipe
	    if (diffY > 0) {
	        slideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        slideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}

	document.getElementById("score").innerText = score;

	checkWin();

	// Call hasLost() to check for game over conditions
	if (hasLost()) {
	    // Use setTimeout to delay the alert
	    setTimeout(() => {
	    alert("Game Over! You have lost the game. Game will restart");
	    restartGame();
	    alert("Click any key to restart");
	    }, 100); 
	}

})