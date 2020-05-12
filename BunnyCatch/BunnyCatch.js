// README
/*
 Bunny, Catch!
 Daphne Lai
 -----------------------------------------------------------------------------------------------------------------------
 BUGS
 1. when hit by a cookie/carrot, you return to normal after a random amount of time
 2. you can only collect falling objects from the top of the bunny (not the sides)
 3. THE SOUND BUTTON IS THERE FOR VISUALS. THERE IS NO SOUND IN THE GAME.
 
 */
// all code goes below here ....
/*-------------------------------------------------------------------------- GLOBAL VARIABLES --------------------------------------------------------------------------*/
// in-game animated bunny character
let arBunR = [], arBunL = []; // right and left image frames
let nBunDx, nBunFPS, nBunFrame = 0; // 'D' means delta (change)
let nBunX, nBunH;
let isMoveL = false; 
let nBunState = 1; // speed state

// in-game objects
let arCookie = [], arCarrot = [], arPellet = []; // in-game animated objects frames
let arCookieX = [], arCookieY = [], arCookieDy = []; // cookie obj. arrays
let arCarrotX = [], arCarrotY = [], arCarrotDy = []; // carrot obj. arrays
let arPelletX = [], arPelletY = [], arPelletDy = []; // food pellet obj. arrays
let nCarrotFrame = 0, nPelletFrame = 0, nCookieFrame = 0;

// main menu button
let arPlay = [], arMute = [], arInfo = []; // main menu buttons

// game variables
let nState = 0; // game state 
let isComplete = false, isInitiate = true; 
let nCount = 0, nStartTime = 60*30, nTimer; // to keep track of time
let nScore = 0, nToCollect = 10; // scores will be based off pellets collected

/*--------------------------------------------------------------------------- PRELOAD, SET UP & DRAW ----------------------------------------------------------------------------*/
// loads in images -> arrays for animations
function preload() {
  // some objects have different numbered frames therefore different loops
  // load left and right bunny images and cookie images
  for (let i = 0; i < 7; i++) {
    arBunR[i] = loadImage("data/images/rabbit_right/rabbit_right" + i + ".png");
    arBunL[i] = loadImage("data/images/rabbit_left/rabbit_left" + i + ".png");
    arCookie[i] = loadImage("data/images/cookie/cookie" + i + ".png");
  }

  // load carrot images
  for (let j = 0; j < 4; j++) {
    arCarrot[j] = loadImage("data/images/carrot/carrot" + j + ".png");
  }

  // load food pellet images
  for (let k = 0; k < 6; k++) {
    arPellet[k] = loadImage("data/images/pellet/pellet" + k + ".png");
  }

  // some objects simply have two images, so I chose to load without a loop
  // load play button
  arPlay[0] = loadImage("data/images/buttons/play0.png"); 
  arPlay[1] = loadImage("data/images/buttons/play1.png");
  // load mute button
  arMute[0] = loadImage("data/images/buttons/mute0.png");
  arMute[1] = loadImage("data/images/buttons/mute1.png");
  // load info. button
  arInfo[0] = loadImage("data/images/buttons/info0.png");
  arInfo[1] = loadImage("data/images/buttons/info1.png");
}

function setup() {
  createCanvas(800, 600);
  nTimer = nStartTime;  // initalize timer for 30 seconds
  isMoveL = false; // bunny begin moving towards the right
  nBunX = width/2;
}

function draw() {
  // checks and updates which game states
  if (nState === 0) { // 0 = main menu
    home();
    print("update: HOME");
  } else if (nState === 1) { // 1 = in-game
    play();
    // print("update: IN-GAME");
  } else if (nState === 2) { // 2 = game over
    gameOver();
    print("update: ENDGAME");
  } else if (nState === 3) {  // 3 = instructions
    instructions();
    print("update: INSTRUCTIONS");
  }
}

/*---------------------------------------------------------------------------- GAME STATES ----------------------------------------------------------------------------*/

// ------------- MAIN MENU STATE ------------- //
function home() {
  background("#E6FCFF"); // light blue

  // text for game title
  textFont('Courier');
  textSize(80);
  textAlign(CENTER);
  fill(0);
  text("BUNNY, CATCH!", width/2, 100);

  // display active buttons
  imageButton(arPlay, width/2 - 100, height/2, 200, 1); // play button
  imageButton(arInfo, width/2 - 80, height/2 + 100, 45, 3); // info. button
  imageButton(arMute, width/2, height/2 + 100, 80, 0); // mute sound button

  // need this to initialize object var. one time
  isInitiate = true;
}

// ------------- IN GAME STATE ------------- //
function play() {
  background("#FFE6F0"); // light pick

  // frame counter and game timer
  nCount++;
  nTimer--;

  // runs once when game starts
  if (isInitiate) {
    // initialize bunny @ normal speed
    nBunState = 1; 
    // initialize object locations
    startLevel();
    isInitiate = false;
  } 

  // draw falling obj.
  carrotFall();
  pelletFall();
  cookieFall();
  // draw bunny
  bunnyDraw();
  // display player statistics
  playerStats();
  // button to exit game in top right corner
  rectButton(width - 67, 25, 115, 30, "exit game", 0);
}

// ------------- INSTRUCTION SCREEN STATE ------------- //
function instructions() {
  background("#F5E6FF"); // pastel purple

  // text for title
  textFont('Courier');
  textSize(70);
  textAlign(CENTER);
  fill(0);
  text("welcome to the"+ '\n' +"instructions", width/2, 100);

  // text to explain game objective
  textSize(20);
  textAlign(LEFT);
  text("objective: collect 10 food pellets    in under 30 seconds.", 50, height/2 - 10);
  image(arPellet[0], 470, height/2 - 25, 25, 20); // draws a pellet

  // text to explain game controls
  // big chunks of ' ' make room for images
  text("controls: you're controlling a bunny named Gozu Jr.          " +
    '\n' + "he'll already be moving back and forth.", 50, height/2 + 50);
  text("use the < arrow key to move to the RIGHT." + 
    '\n' + "use the > arrow key to move to the LEFT. ", 170, height/2 + 120);
  image(arBunL[0], width - 125, height/2 + 30, 65, 60); // draws a bunny

  // text to explain game obstacles
  text("obstacles: cookies    will slow you down.", 50, height/2 + 200);
  image(arCookie[0], 275, height/2 + 183, 25, 25); // draws a cookie
  text("carrots   will speed you up.", 180, height - 60);
  image(arCarrot[0], 272, height - 82, 20, 30); // draws a carrot

  // 'return to home' button at bottom right corner
  rectButton(width - 130, height - 50, 100, 25, "< home!", 0);
}

// ------------- GAME OVER STATE ------------- //
function gameOver() {
  background("#E6F0FF"); // pastel blue-grey
  isInitiate = true;

  // text sized 80
  textFont('Courier');
  textSize(80);
  strokeWeight(1);
  textAlign(CENTER);
  fill(0);

  // boolean to change text depending on how they exited the game
  if (isComplete) {
    text("Cleared!!", width/2, height/2);
  } else {
    text("Game Over :(", width/2, height/2);
  }

  //text sized 15pt
  fill(0);
  textSize(15);
  strokeWeight(1);
  stroke(0);
  text("want to play again?", width/2, height/2+40);

  // draw two buttons. Either to play again, or exit.
  rectButton(width/2 - 100, height/2 + 100, 100, 25, "sure!", 1);
  rectButton(width/2 + 100, height/2 + 100, 100, 25, "nope.", 0);
}

// ------------- START LEVEL FUNCTION ------------- //
// set up a new level
function startLevel() {
  // sets count-based variables to initial values
  nCount = 0;
  nTimer = nStartTime; // 30 seconds
  nScore = 0;
  nToCollect = 10;

  // initialize (x, y) and falling speed for two carrots and cookies
  for (let l = 0; l < 2; l++) {
    // the carrots'
    arCarrotX[l] = random(30, width-30);
    arCarrotY[l] = -100;
    arCarrotDy[l] = random(1, 3);

    // the cookies'
    arCookieX[l] = random(30, width-30);
    arCookieY[l] = -100;
    arCookieDy[l] = random(1, 3);
  }

  // initialize (x, y) and falling speed for five pellets
  for (let f = 0; f < 5; f++) {
    arPelletX[f] = random(30, width-30);
    arPelletY[f] = -100;
    arPelletDy[f] = random(1, 3);
  }
}

/*----------------------------------------------------------------------------- IN GAME OBJECTS -----------------------------------------------------------------------------*/

// ------------- COOKIE OBJECTS ------------- //
function cookieFall() {
  let nAspRatio = arCookie[nCookieFrame].height/arCookie[nCookieFrame].width;
  let nCookieW = 40, nCookieH = nCookieW * nAspRatio;  // width and height of obj.

  // creates two sets of (x, y), changes Y accordingly 
  for (let z = 0; z < 2; z++) {
    if (arCookieY[z] > height) {
      arCookieX[z] = random(30, width-30);
      arCookieY[z] = -100;
      arCookieDy[z] = random(1, 3);
    } else { 
      arCookieY[z]+= arCookieDy[z];
    }

    // switch image for 15 fps
    if (nCount%15 === 0) {
      nCookieFrame++;
      if (nCookieFrame === arCookie.length) {
        nCookieFrame = 0; // loops iteration
      }
    }

    // check if cookie hits bunny
    if (bunHit(arCookieX[z], arCookieY[z], nCookieW, nCookieH)) {
      // reset object's location
      arCookieX[z] = random(30, width-30);
      arCookieY[z] = -100;
      arCookieDy[z] = random(1, 3);
      nBunState = 0; // slows bunny
    }

    // draw falling cookie
    image(arCookie[nCookieFrame], arCookieX[z], arCookieY[z], nCookieW, nCookieH);
  }
}

// ------------- CARROT OBJECT ------------- //
function carrotFall() {
  let nAspRatio = arCarrot[nCarrotFrame].height/arCarrot[nCarrotFrame].width;
  let nCarrotW = 30, nCarrotH = 30 * nAspRatio; 

  // creates two sets of (x, y), changes Y accordingly 
  for (let l = 0; l < 2; l++) {
    if (arCarrotY[l] > height) {
      arCarrotX[l] = random(30, width-30);
      arCarrotY[l] = -100;
      arCarrotDy[l] = random(1, 3);
    } else {
      arCarrotY[l]+= arCarrotDy[l];
    }

    // switch image for 15 fps
    if (nCount%15 === 0) {
      nCarrotFrame++;
      if (nCarrotFrame === arCarrot.length) {
        nCarrotFrame = 0; // loops iteration
      }
    }

    // check if the bunny gets hit by carrot
    if (bunHit(arCarrotX[l], arCarrotY[l], nCarrotW, nCarrotH)) {
      arCarrotX[l] = random(30, width-30);
      arCarrotY[l] = -100;
      arCarrotDy[l] = random(1, 3);
      nBunState = 2; // speeds bunny
    } 

    // draw falling carrots
    image(arCarrot[nCarrotFrame], arCarrotX[l], arCarrotY[l], nCarrotW, nCarrotH);
  }
}

// ------------- PELLET OBJECTS ------------- //
// draws the falling pellets!!
function pelletFall() {
  let nAspRatio = arPellet[nPelletFrame].height/arPellet[nPelletFrame].width;
  let nPelletW = 30, nPelletH = nPelletW * nAspRatio; 

  // creates five sets of (x, y), changes Y accordingly 
  for (let f = 0; f < 5; f++) {
    if (arPelletY[f] > height) {
      arPelletX[f] = random(30, width-30);
      arPelletY[f] = -100;
      arPelletDy[f] = random(1, 3);
    } else {
      arPelletY[f]+= arPelletDy[f];
    }

    // switch image for 15 fps
    if (nCount%15 === 0) {
      nPelletFrame++;
      if (nPelletFrame === arPellet.length) {
        nPelletFrame = 0;
      }
    }

    // check if the bunny gets hit by pellets
    if (bunHit(arPelletX[f], arPelletY[f], nPelletW, nPelletH)) {
      arPelletX[f] = random(30, width-30);
      arPelletY[f] = -100;
      arPelletDy[f] = random(1, 3);
      nScore++; // increases score
    }

    // draw pellets
    image(arPellet[nPelletFrame], arPelletX[f], arPelletY[f], nPelletW, nPelletH);
  }
}

/*------------------------------------------------------------------------------- BUNNY ASSETS -------------------------------------------------------------------------------*/

// ------------- DRAW BUNNY ------------- //
function bunnyDraw() {
  let nAspRatio = arBunR[0].height/arBunR[0].width;
  let nBunW = 100;
  nBunH = nBunW * nAspRatio;

  // determine speed of bunny
  bunnySpeed(nBunState); 

  // draw according to direction
  if (!isMoveL) { // he move right
    image(arBunR[nBunFrame], nBunX, height - nBunH, nBunW, nBunH ); // draw
    // turn left after x exceeds width
    if (nBunX > (width - nBunW)) { 
      isMoveL = true;
    }
  } else { // he move left
    image(arBunL[nBunFrame], nBunX, height - nBunH, nBunW, nBunH ); // draw
    // turn right after reaching x = 0
    if (nBunX < 0) {
      isMoveL = false;
    }
  }
}

// ------------- SPEED OF THE BUNNY ------------- //
function bunnySpeed() {
  if (nBunState === 1) { // normal speed
    nBunDx = 12; 
    nBunFPS = 8;
  } else if (nBunState === 0) { // frusteratively slow
    nBunDx = 5;
    nBunFPS = 13;
    if (nCount%500 === 0) {
      nBunState = 1;
    }
  } else if (nBunState === 2) { // super sonic fast
    nBunDx = 15;
    nBunFPS = 3;
    if (nCount%500 === 0) {
      nBunState = 1;
    }
  }

  // draws frames according to nBunState
  if (nCount%nBunFPS === 0) {
    nBunFrame++;
    if (!isMoveL) {
      nBunX+=nBunDx;
    } else {
      nBunX-=nBunDx;
    }
    if (nBunFrame === arBunR.length) {
      nBunFrame = 0; // loops interation
    }
  }
}

/*------------------------------------------------------------------------------- PLAYER STATISTICS -------------------------------------------------------------------------------*/

function playerStats() {
  // width of the timer bar
  let nBarW;

  // white rect under the text
  fill(255);
  rectMode(CORNER);
  rect(10, 10, 115, 30);
  rect(10, 45, 115, 30);

  // text size 15pt 
  textSize(15);
  textAlign(LEFT);
  textFont('Courier');
  fill(0);
  stroke(0);
  strokeWeight(1);

  // the text itself
  text("Score: " + nScore, 20, 30);
  text("Collect: " + (nToCollect - nScore), 20, 65);

  // draw timer bar
  nBarW = map(nTimer, nStartTime, 0, 0, width);
  strokeWeight(5);
  strokeJoin(MITER);
  stroke(150, 50);
  line(0, 2, width, 2);
  stroke('RED');
  line(0, 2, nBarW, 2);

  // if the player clears, or fails the level is determined here 
  if (nScore >= nToCollect) {
    isComplete = true;
    nState = 2;
  } else if (nTimer === 0) {
    isComplete = false;
    nState = 2;
  }
}

/*------------------------------------------------------------------------------- BUTTONS -------------------------------------------------------------------------------*/

// ------------- IMAGE-BASED BUTTONS ------------- //
function imageButton(arButton, nBtnX, nBtnY, nBtnW, nNewState) {
  let nAspRatio = arButton[0].height/arButton[0].width;
  let nBtnH = nBtnW * nAspRatio;

  // check if mouse hover
  if (imageHit(nBtnX, nBtnY, nBtnW, nBtnH)) { 
    image(arButton[1], nBtnX, nBtnY, nBtnW, nBtnH);
    if (mouseIsPressed) {
      nState = nNewState; // change game state
    }
  } else {
    image(arButton[0], nBtnX, nBtnY, nBtnW, nBtnH);
  }
}

// ------------- RECT(); BUTTONS ------------- //
function rectButton(nBtnX, nBtnY, nBtnW, nBtnH, nBtnText, nNewState) {
  // check if mouse hover
  if (rectHit(nBtnX, nBtnY, nBtnW, nBtnH)) {
    fill(255, 300);
    if (mouseIsPressed) {
      nState = nNewState;
    }
  } else {
    fill(255, 50);
  }

  // rect
  stroke(0);
  strokeWeight(1);
  rectMode(CENTER);
  rect(nBtnX, nBtnY, nBtnW, nBtnH);

  // text for button
  fill(0);
  textSize(15);
  textAlign(CENTER);
  text(nBtnText, nBtnX, nBtnY + 5);
}

/*----------------------------------------------------------------------------- INPUT/EVENT LISTENERS -----------------------------------------------------------------------------*/
// ------------- BUNNY/OBJECT HIT TEST ------------- //
function bunHit(nX, nY, nW, nH) {
  if (nX >= nBunX && nX <= (nBunX + 100) && (nY + nH) >= (height-nBunH) && nY <= (height-nBunH)) {
    return true;
  } else {
    return false;
  }
}

// ------------- MOUSE/IMAGE BTN HIT TEST ------------- //
function imageHit(bX, bY, bW, bH) {
  if (mouseX > bX && mouseX < (bX + bW) && mouseY > bY && mouseY < (bY + bH)) {
    return true;
  } else {
    return false;
  }
}

// ------------- MOUSE/RECT BTN HIT TEST ------------- //
function rectHit(nBtnX, nBtnY, nBtnW, nBtnH) {
  let nW2 = nBtnW/2;
  let nH2 = nBtnH/2;
  if (mouseX > nBtnX - nW2 && mouseX < nBtnX + nW2 && mouseY > nBtnY - nH2 && mouseY < nBtnY + nH2) {
    return true;
  } else {
    return false;
  }
}

// ------------- CHANGE BUNNY DIRECTION ------------- //
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    isMoveL = false; // move bunny right
  } else if (keyCode === RIGHT_ARROW) {
    isMoveL = true; // move bunny left
  }
}
