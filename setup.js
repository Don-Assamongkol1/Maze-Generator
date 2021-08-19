// Set up
let amGeneratingMaze = false;
const numCells = 10;
// const mazeWidthPixels = 600;
const mazeWidthPixels = 400;
let myMaze = new Maze(mazeWidthPixels, numCells);
const canvas = document.querySelector("#myCanvas");
const timeDelay = 10;
const fastTimeDelay = 20;
const superFastTimeDelay = 0.5;
const slowTimeDelay = 50;

myMaze.setUp();
myMaze.draw();

// showButtonsInRunningState
function showButtonsInRunningState(runningAlgoId) {
  buttons = document.querySelectorAll(".button");
  for (button of buttons) {
    if (button.id !== runningAlgoId) {
      button.setAttribute("disabled", null);
    }
  }

  runningButton = document.querySelector(runningAlgoId);
  runningButton.classList.add("is-primary");
}

// resets all buttons, making them clickable etc.
function resetButtons() {
  buttons = document.querySelectorAll(".button");
  for (button of buttons) {
    button.removeAttribute("disabled", null);
    button.classList.remove("is-primary");
  }
}

// executeMazeGeneration wrapper function
async function executeMazeGeneration(algorithmId) {
  myMaze.reset();
  myMaze.draw();

  showButtonsInRunningState(algorithmId); // add line here to reset maze first

  if (algorithmId === "#binaryTree") {
    // bunch of if statements to get the given algo to run
    runBinaryTree();
  } else if (algorithmId === "#sideWinder") {
    runSideWinder();
  } else if (algorithmId === "#recursiveDFS") {
    runRecursiveDFS();
  } else if (algorithmId === "#AldousBroder") {
    runAldousBroder();
  } else if (algorithmId === "#Wilsons") {
    runWilsons();
  } else if (algorithmId === "#huntAndKill") {
    runHuntAndKill();
  }

  await new Promise((r) => setTimeout(r, timeDelay * myMaze.numCells * myMaze.numCells));

  resetButtons();
}

// Add Event listeners for buttons on the page
const binaryTreeButton = document.querySelector("#binaryTree");
const sideWinderButton = document.querySelector("#sideWinder");
const recursiveDFSButton = document.querySelector("#recursiveDFS");
const AldousBroderButton = document.querySelector("#AldousBroder");
const WilsonsButton = document.querySelector("#Wilsons");
const huntAndKillButton = document.querySelector("#huntAndKill");

binaryTreeButton.addEventListener("click", function () {
  executeMazeGeneration("#binaryTree");
});
sideWinderButton.addEventListener("click", function () {
  executeMazeGeneration("#sideWinder");
});
recursiveDFSButton.addEventListener("click", function () {
  executeMazeGeneration("#recursiveDFS");
});
AldousBroderButton.addEventListener("click", function () {
  executeMazeGeneration("#AldousBroder");
});
WilsonsButton.addEventListener("click", function () {
  executeMazeGeneration("#Wilsons");
});
huntAndKillButton.addEventListener("click", function () {
  executeMazeGeneration("#huntAndKill");
});
