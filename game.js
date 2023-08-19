var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var gameStarted = false;
var lives = 3;
var score = 0;
var break_ = []
var tanks = [];
var bombs = [];




var lastPressed = false;
var timeout = 0;
function keyup(event) {
    if (!gameStarted) return;
    var player = document.getElementById('player');
    if (event.keyCode == 37) {
        leftPressed = false;
        lastPressed = 'left';
    }
    if (event.keyCode == 39) {
        rightPressed = false;
        lastPressed = 'right';
    }
    if (event.keyCode == 38) {
        upPressed = false;
        lastPressed = 'up';
    }
    if (event.keyCode == 40) {
        downPressed = false;
        lastPressed = 'down';
    }

    player.className = 'character stand ' + lastPressed;
}


function getBombEscaped() {
    return totalBombs;
}


function move() {
    if (!gameStarted) return;
    var player = document.getElementById('player');
    var positionLeft = player.offsetLeft;
    var positionTop = player.offsetTop;

    if (downPressed == true) {
        var newTop = positionTop + 1;
        if (!checkCollision(positionLeft, newTop)) {
            player.style.top = newTop + 'px';
            player.className = 'character walk down';
        }
    }
    if (upPressed == true) {
        var newTop = positionTop - 1;
        if (!checkCollision(positionLeft, newTop)) {
            player.style.top = newTop + 'px';
            player.className = 'character walk up';
        }
    }
    if (leftPressed == true) {
        var newLeft = positionLeft - 1;
        if (!checkCollision(newLeft, positionTop)) {
            player.style.left = newLeft + 'px';
            player.className = 'character walk left';
        }
    }
    if (rightPressed == true) {
        var newLeft = positionLeft + 1;
        if (!checkCollision(newLeft, positionTop)) {
            player.style.left = newLeft + 'px';
            player.className = 'character walk right';
        }
    }
}

function checkCollision(x, y) {
    var cacti = document.querySelectorAll('.cactus');
    for (var i = 0; i < cacti.length; i++) {
        var cactusLeft = cacti[i].offsetLeft;
        var cactusRight = cactusLeft + cacti[i].offsetWidth;
        var cactusTop = cacti[i].offsetTop;
        var cactusBottom = cactusTop + cacti[i].offsetHeight;

        if (x < cactusRight && x + 32 > cactusLeft && y < cactusBottom && y + 48 > cactusTop) {
            if (cacti[i].classList.contains('cactus')) {
                return true; // pass over the cactus
            }
            else {
                return false; // collided with another element
            }
        }
    }
    return false; // no collision detected
}






function keydown(event) {
    if (event.keyCode == 37) {
        leftPressed = true;
    }
    if (event.keyCode == 39) {
        rightPressed = true;
    }
    if (event.keyCode == 38) {
        upPressed = true;
    }
    if (event.keyCode == 40) {
        downPressed = true;
    }
}


function shootArrows() {
    // Get character and add class to make character shoot arrow
    const player = document.getElementById('player');
    player.className = 'character stand up fire';

    // Create the arrow element
    const arrow = document.createElement('div');
    arrow.className = 'arrow up';

    // Get the player's current position
    // or use the default from the css property of player top: 88vh; left: 200px;
    arrow.style.top = (player.style.top !== '') ? player.style.top : `${88}vh`;
    arrow.style.left = (player.style.left !== '') ? player.style.left : `${228}px`;

    // Adds arrow to body
    body.append(arrow);

    // set interval to move the arrow up.
    startInterval3 = setInterval(() => {
    const newTop = arrow.offsetTop - 2;
    arrow.style.top = `${newTop}px`;
    }, 10);
}







//
function myLoadFunction() {
    timeout = setInterval(move, 10);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    document.getElementById("start").addEventListener("click", startGame)

    var startButton = document.querySelector('.start');
    body = document.getElementsByTagName('body')[0];
    startButton.addEventListener('click', function() {
        startButton.style.display = 'none';
        gameStarted = true;


       
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
        // player only shoot after 0.5ms
        setTimeout(shootArrows, 500);
        }
    });
}

function spawnEnemy() {
    var tank = document.createElement("div");
    tank.className = "tank";
    tank.id = "tank";
    tank.style.zIndex = "2"
    while (true) {
        tank.style.left = Math.floor(Math.random() * document.body.offsetWidth) + "px";
        if (document.elementFromPoint(tank.offsetLeft, tank.offsetTop).classList.contains("tank") == false) {  
            document.body.appendChild(tank);
            tankLogic = setInterval(spawnBomb, Math.floor(Math.random() * 3000-1000) + 1000);
            tanks.push([tank, tankLogic]);
            console.log("tank Spawned")
            break;
        }
    }
}

/*Spawns a bomb*/
function spawnBomb() {
    var tank = tanks[Math.floor(Math.random() * tanks.length)];
    var bomb = document.createElement("div");
    bomb.className = "bomb";
    bomb.style.left = "28px";
    bomb.style.top = "70px";
    bomb.style.zIndex = "1";
    bomb.style.display = "absolute";
    if (Math.floor(Math.random() * 4) < 2) {
        bomb.style.transform = "rotate(45deg)";
    }
    else if (Math.floor(Math.random() * 4) > 2) {
        bomb.style.transform = "rotate(135deg)";
    }
    tank[0].appendChild(bomb);
    bombs.push(bomb);
    console.log("Bomb Spawned")
}

/*Makes a random bomb fall a set amount and explodes if colliding with the floor*/

function fall() {
    for (let element of bombs) {
        if (element.style.transform === "rotate(45deg)") {
            element.style.top = (element.offsetTop + 10) + "px";
            element.style.left = (element.offsetLeft + 10) + "px";
        }
        else if (element.style.transform === "rotate(135deg)") {
            element.style.top = (element.offsetTop + 10) + "px";
            element.style.left = (element.offsetLeft - 10) + "px";
        }  
        element.style.left = (element.offsetLeft - 10) + "px";
        element.style.top = (element.offsetTop + 10) + "px";
       
        var elemRect = element.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
        var skyRect = document.getElementsByClassName("sky")[0].getBoundingClientRect();
       
        if (elemRect.bottom >= skyRect.bottom || elemRect.bottom <= bodyRect.offsetHeight) {
            if (Math.floor(Math.random() * 100) < 10) {
                element.className = "explosion";
                setTimeout(() => { element.remove() }, 3000);
                bombs.splice(bombs.indexOf(element), 1);
                score += 1;
            }
        }
    }
}


/*Checks to see if player is colliding with exploded bomb*/
function checkExplosion() {
    for (let element of document.getElementsByClassName("explosion")) {
        var elemRect = element.getBoundingClientRect();
        var playerRect = document.getElementById("player").getBoundingClientRect();
        if (elemRect.bottom >= playerRect.top && elemRect.right >= playerRect.left && elemRect.left <= playerRect.right && elemRect.top-40 <= playerRect.bottom) {
            score -= 1;
            if (lives <= 1) {
                document.getElementById("player").className = "character dead";
                endGame();
            }
            else {
                element.remove();
                document.getElementsByTagName("li")[lives-1].style.display = "none";
                lives -= 1;            
            }
        }
    }
}



function showDisplay(mode) {
    for (let element of document.body.getElementsByTagName("*")) {
        element.style.display = mode;
    }
}





/*Starts game functionality*/
function startGame() {
   
        localStorage.clear();
        if (document.body.contains(document.getElementById("scoreBoard"))) {
            document.getElementById("scoreBoard").remove();
        }

       
        document.getElementById("player").className = "character";
        lives = 3;
        showDisplay("block");
        document.getElementById("start").style.display = "none";
        document.getElementsByClassName("weapon")[0].style.display = "none";
        break_.push(setInterval(move, 10));
        break_.push(setInterval(spawnEnemy, 2500));
        setTimeout(break_.push(setInterval(fall, 50)), 2500);
        break_.push(setInterval(checkExplosion, 1));
    //}
}


function endGame() {
    for (let item of break_) {
        clearInterval(item);
    }

    for (let item of document.getElementsByClassName("bomb")) {
        item.remove();
    }

    for (let item of document.getElementsByClassName("explosions")) {
        item.remove();
    }

    for (let tank of tanks) {
        clearInterval(tank[1]);
        tank[0].remove();
    }

    var button = document.getElementById("start");
    var text = document.createElement("p");
   
    // text.innerHTML = "{Game Over}";
    text.innerHTML = "Game Over ! <br> Your Score is "+score;
    button.appendChild(text);
    showDisplay("none");
    button.style.display = "block";
    text.style.display = "block";
    setScore();
    scoreBoard();
   
}
function setScore() {
    var name = prompt('Enter your name:');
    if (name && score) {
        var currentTime = new Date().toLocaleTimeString();
        var scoreData = { score: score, timePlayed: currentTime };
        localStorage.setItem(name, JSON.stringify(scoreData));
    }
}



function getScores() {
    var values = [];
    var keys = Object.keys(localStorage);

    for (let i of keys) {
        var scoreData = JSON.parse(localStorage.getItem(i));
        var score = scoreData.score;
        var timePlayed = scoreData.timePlayed;
        values.push([score, i, timePlayed]);
    }
    return values;
}
   
function scoreBoard() {
    var board = document.createElement("table");
    var scores = getScores();
    scores.sort(twoDimensionalSort);

    var headerRow = document.createElement("tr");
    var header1 = document.createElement("th");
    header1.textContent = "Score";
    headerRow.appendChild(header1);
    var header2 = document.createElement("th");
    header2.textContent = "Name";
    headerRow.appendChild(header2);
    board.appendChild(headerRow);

    for (let i in scores) {
        var row = document.createElement("tr");
        var col1 = document.createElement("td");
        col1.textContent = scores[i][0];
        row.appendChild(col1);
        var col2 = document.createElement("td");
        col2.textContent = scores[i][1];
        row.appendChild(col2);
        board.appendChild(row);
    }
    board.id = "scoreBoard";
    board.style.marginTop = "150px";
    board.style.marginLeft = "auto";
    board.style.marginRight = "auto";
    board.style.display = "table";
    board.style.borderCollapse = "collapse";
    board.style.border = "3px solid black";
    board.style.width = "400px";
    board.style.height = "200px";

    document.body.appendChild(board);
}

function twoDimensionalSort(a, b) {
    return b[0] - a[0];
}


document.addEventListener('DOMContentLoaded', myLoadFunction);