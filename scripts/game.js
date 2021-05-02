// Game
const board       = document.getElementsByClassName('cardHolder')[0];
const cards       = [1,1,2,2,3,3,4,4,5,5,6,6];
let   gameStarted = false;

// Selections
let cardValue  = [];
let card_tile  = [];
let cardHold   = [];    // Matched cards
let selections = null;
let flipped    = null;
let firstFlip = true;
let timer = null;
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
let scoreLabel = document.getElementById("score");
let score = 0;

// Shuffle function
Array.prototype.shuffle = function() {
    let i = this.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}

/* Add cards to board */
function newGame() {
    // Don't generate if there already is a game
    if (gameStarted) {
        return;
    }

    cards.shuffle();
    flipped = 0;

    // Clear board if its filled already
    clearBoard();

    for (let i = 0; i < cards.length; i++) {
        // Create new li
        const cardLi = document.createElement('li');
        cardLi.classList.add('tileboard');

        // Create the card class
        const card = document.createElement('div');
        card.classList.add('card');      // Assign className to new element
        card.classList.add(`tile_${i}`); // set identifier for card
        card.setAttribute('onclick', `flipTile(this, ${cards[i]})`);

        // Append card to Li, and then that to the board
        cardLi.appendChild(card);
        board.appendChild(cardLi);
    }
    gameStarted = true;
}

function flipTile(tile, val) {
    if (firstFlip) {
        timer = setInterval(setTime, 1000);
        firstFlip = false;
    }

    // Check if card already is matched or is currently selected
    if (cardHold.includes(tile.classList[1])) {
            return;
    }

    if (card_tile.includes(tile.classList[1])) {
        return;
    }

    // Only process 2 clicks at a time
    selections++;
    if (selections > 2) {
        return;
    }

    // Set background for tile
    tile.style.background = `rgb(4, 99, 143) url(images/img-${val}.png)`;

    // First card selected
    if (cardValue.length === 0) {
        cardValue.push(val);
        card_tile.push(tile.classList[1]);
    }

    // Second card selected
    else if (cardValue.length === 1) {
        cardValue.push(val);
        card_tile.push(tile.classList[1]);

        // Check if matching
        if (cardValue[0] == cardValue[1]) {
            flipped += 2;
            updateScore();

            // Save the 2 cards
            cardHold.push(card_tile[0]);
            cardHold.push(card_tile[1]);

            // Reset
            card_tile = [];
            cardValue = [];
            selections = 0;

            // Check game end conditions
            setTimeout(function() {
                if (flipped == cards.length) {
                    gameStarted = false;
                    if (window.confirm('Congratulations, you won! Want to play again?'))
                    {
                        // Flip all cards back
                        const tmp = document.querySelectorAll('.card');
                        tmp.forEach(function(e) {
                            e.style.background = 'url(images/default.png)';
                        });

                        // Start new game
                        setTimeout(function() {
                            resetGame();
                        }, 400);
                    }
                }
            }, 750);
        }

        // Flipback when not a match
        else {
            setTimeout(function() {
                // Change back
                for (let i = 0; i < card_tile.length; i++) {
                    const selected = document.querySelector(`.${card_tile[i]}`);
                    selected.style.background= 'url(images/default.png)';
                }

                // Reset
                card_tile = [];
                cardValue = [];
                selections = 0;
            }, 750);
        }
    }
};

function clearBoard() {
    var divs = document.querySelectorAll('.tileboard');
    if (divs.length > 1)
        Array.from(divs).forEach((div) => div.remove())
};

// Setup a game on first sight
window.onload = function () {
    newGame();
};

// New game functionallity
const key = document.getElementsByClassName('key')[1];
key.addEventListener('click', () => {
    resetGame();
});

// Timer function
function resetTime() {
    clearInterval(timer);
    totalSeconds = 0;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// Score function
function resetScore() {
    score = 0;
    scoreLabel.innerHTML = score;
}

function updateScore() {
    score++;
    scoreLabel.innerHTML = score;
}

// Reset the board
function resetGame() {
    // Disable game
    gameStarted = false;
    resetTime();
    resetScore();

    // Reset variables
    cardValue = [];
    card_tile = [];
    cardHold = [];
    selections = null;
    flipped = null;
    firstFlip = true;

    // Clear board
    const divs = document.querySelectorAll('.tileboard');
    divs.forEach(function (e) {
        e.style.opacity = '0';
    });

    setTimeout(function () {
        newGame(); // Calls resetBoard() aswell, no need to do it in this function
    }, 900);
}
