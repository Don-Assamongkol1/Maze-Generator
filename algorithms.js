//
//
async function runBinaryTree() {
  for (let rowNum = myMaze.numCells - 1; rowNum >= 0; rowNum--) {
    for (let colNum = 0; colNum < myMaze.numCells; colNum++) {
      let currentCell = myMaze.grid[rowNum][colNum];

      currentCell.visited = true;

      if (currentCell.row === 0 && currentCell.column === myMaze.numCells - 1) {
      } else if (currentCell.row === 0) {
        rightCell = myMaze.grid[currentCell.row][currentCell.column + 1];
        myMaze.removeWalls(currentCell, rightCell);
      } else if (currentCell.column === myMaze.numCells - 1) {
        aboveCell = myMaze.grid[currentCell.row - 1][currentCell.column];
        myMaze.removeWalls(currentCell, aboveCell);
      } else {
        if (Math.random() > 0.5) {
          rightCell = myMaze.grid[currentCell.row][currentCell.column + 1];
          myMaze.removeWalls(currentCell, rightCell);
        } else {
          aboveCell = myMaze.grid[currentCell.row - 1][currentCell.column];
          myMaze.removeWalls(currentCell, aboveCell);
        }
      }

      myMaze.draw();
      currentCell.highlight();
      await new Promise((r) => setTimeout(r, timeDelay));
    }
  }
  myMaze.draw();

  assignDistanceFromStart(myMaze.grid[myMaze.numCells - 1][0]);
}

// sidewinder from bottom left to top righti.e. decide whether to carve east or south
//
async function runSideWinder() {
  currentRunOfCells = [];
  for (let rowNum = myMaze.numCells - 1; rowNum >= 0; rowNum--) {
    for (let colNum = 0; colNum < myMaze.numCells; colNum++) {
      let currentCell = myMaze.grid[rowNum][colNum];
      currentCell.visited = true;

      let madeNewVerticalWall = false;
      // bottom row is all connected
      if (currentCell.row === myMaze.numCells - 1 && currentCell.column === myMaze.numCells - 1) {
      } else if (currentCell.row === myMaze.numCells - 1) {
        rightCell = myMaze.grid[currentCell.row][currentCell.column + 1];
        myMaze.removeWalls(currentCell, rightCell);
      }

      // add cells to current run
      else {
        currentRunOfCells.push(currentCell);
        if (currentCell.column === myMaze.numCells - 1 || Math.random() > 0.65) {
          randomCell = getRandomCellFromArray(currentRunOfCells);
          southCell = myMaze.grid[randomCell.row + 1][randomCell.column];
          myMaze.removeWalls(randomCell, southCell);
          currentRunOfCells = [];
          madeNewVerticalWall = true;
        } else {
          eastCell = myMaze.grid[currentCell.row][currentCell.column + 1];
          myMaze.removeWalls(currentCell, eastCell);
        }
      }

      myMaze.draw();
      currentCell.highlight();
      if (madeNewVerticalWall) {
        randomCell.highlightWallBreak();
        southCell.highlightWallBreak();
      }
      await new Promise((r) => setTimeout(r, timeDelay));
    }
  }
  myMaze.draw();
  assignDistanceFromStart(myMaze.grid[myMaze.numCells - 1][0]);
}

//
//
async function runRecursiveDFS() {
  stack = [myMaze.grid[myMaze.numCells - 1][0]];

  while (stack.length > 0) {
    currentCell = stack.pop();
    currentCell.visited = true;
    currentCell.visitedByMazeGenerator = true;

    unvisitedNeighbors = getNeighbors(currentCell, true, false, false);
    nextCell = getRandomCellFromArray(unvisitedNeighbors);
    if (nextCell) {
      stack.push(currentCell);
      myMaze.removeWalls(currentCell, nextCell);
      nextCell.visitedByMazeGenerator = true;
      stack.push(nextCell);
    }
    myMaze.draw();
    currentCell.highlight();
    await new Promise((r) => setTimeout(r, timeDelay));
  }
  myMaze.draw();
  assignDistanceFromStart(myMaze.grid[myMaze.numCells - 1][0]);
}

//
//
async function runAldousBroder() {
  // pick random starting cell
  let currentCell = getRandomCell(myMaze);
  const startRow = currentCell.row;
  const startColumn = currentCell.column;

  let totalNotVisited = myMaze.numCells ** 2 - 1;

  while (totalNotVisited > 0) {
    currentCell.visitedByMazeGenerator = true;

    neighbors = getNeighbors(currentCell, false, false, false);
    nextCell = getRandomCellFromArray(neighbors);

    if (!nextCell.visitedByMazeGenerator) {
      myMaze.removeWalls(currentCell, nextCell);
      totalNotVisited -= 1;
    }

    myMaze.draw();
    currentCell.highlight();
    currentCell = nextCell;
    await new Promise((r) => setTimeout(r, superFastTimeDelay));
  }
  myMaze.draw();
  assignDistanceFromStart(myMaze.grid[startRow][startColumn]);
}

//
//
async function runWilsons() {
  let unvisitedCells = [].concat(...myMaze.grid);

  // pick an unvisited cell at random and mark it as visited
  initCell = getRandomCellFromArray(unvisitedCells);
  initCell.visited = true;
  removeItemFromArray(unvisitedCells, initCell);

  // carve out new paths and connect them when path hits a visited cell
  while (unvisitedCells.length > 0) {
    let currentCell = getRandomCellFromArray(unvisitedCells);
    let path = [currentCell];

    // start a path from another unvisited cell picked at random
    while (unvisitedCells.indexOf(currentCell) != -1) {
      currentCell.inPath = true;
      let neighbors = getAllNeighbors(currentCell);
      let nextCell = getRandomCellFromArray(neighbors);

      if (nextCell.visited) {
        path.push(nextCell); // if ever hit a visited cell, then break: carve out the path
        break;
      }

      if (path.indexOf(nextCell) > -1) {
        for (let i = path.indexOf(nextCell); i < path.length; i++) {
          // if ever hit a cell that's part of our current path, delete the loop; eg. [D3, C3, C4, B4, B3] and hit C3 again --> reset path to [D3, C3]
          path[i].inPath = false;
        }
        path.length = path.indexOf(nextCell);
      }
      path.push(nextCell);
      currentCell = nextCell;

      await new Promise((r) => setTimeout(r, timeDelay));
      myMaze.draw();
      currentCell.highlight();
    }

    // connect the path, marking all cells on it as visited
    for (let i = 0; i < path.length - 1; i++) {
      myMaze.removeWalls(path[i], path[i + 1]);
      path[i].visited = true;
      removeItemFromArray(unvisitedCells, path[i]); // last cell of path is by construction already visited
      await new Promise((r) => setTimeout(r, timeDelay));
      myMaze.draw();
    }
  }
  await new Promise((r) => setTimeout(r, timeDelay));
  myMaze.draw();

  assignDistanceFromStart(myMaze.grid[myMaze.numCells - 1][0]);
}

//
//
async function runHuntAndKill() {
  // start by choosing a random cell
  let currentCell = getRandomCell(myMaze);

  while (currentCell) {
    currentCell.visited = true;
    currentCell.visitedByMazeGenerator = true;
    unvisitedNeighbors = getUnvisitedNeighbors(currentCell);

    if (unvisitedNeighbors.length > 0) {
      neighborCell = getRandomCellFromArray(unvisitedNeighbors);
      myMaze.removeWalls(currentCell, neighborCell);
      currentCell = neighborCell;
    }

    // Hunt mode: scan top left to bottom right for first unvisited cell
    // that neighbors a visited cell
    else {
      currentCell = getFirstUnvisitedCellwithVisitedNeighbor();
      if (currentCell) {
        visitedNeighbors = getVisitedNeighbors(currentCell);
        visitedNeighbor = getRandomCellFromArray(visitedNeighbors);
        myMaze.removeWalls(currentCell, visitedNeighbor);
      }
    }
    await new Promise((r) => setTimeout(r, timeDelay));
    myMaze.draw();
    if (currentCell) {
      currentCell.highlight();
    }
  }

  await new Promise((r) => setTimeout(r, timeDelay));
  myMaze.draw();
  await new Promise((r) => setTimeout(r, timeDelay));
  myMaze.draw();

  assignDistanceFromStart(myMaze.grid[myMaze.numCells - 1][0]);
}
