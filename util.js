// Helper Func
function getRandomCellFromArray(arrayOfCells) {
  // assumes nonzero
  if (arrayOfCells.length > 0) {
    let idx = Math.floor(Math.random() * arrayOfCells.length);
    return arrayOfCells[idx];
  }
  return undefined;
}

// getNeighbors:
//     Purpose: Gets the neighbors of a cell based on parameters
//        onlyUnvistiedByMazeGenerator: if true, get neighbors only if neighboring cell has not been visited by maze generator
//        wallBarrierOn: if true, only gets neighbors of cell that are accessible (no wall)
//        onlyUnvisitedByDistanceAlgo: if true, gets neighbors only if neighboring cell has not been visited by distance finding algo
//        visitedNeighborsOnly: if true, grabs only neighbors who have been visited

function getNeighbors(
  cell,
  onlyUnvisitedByMazeGenerator,
  wallBarrierOn,
  onlyUnvisitedByDistanceAlgo,
  visitedNeighborsOnly
) {
  neighbors = [];
  let topNeighbor = myMaze.grid[cell.row - 1] ? myMaze.grid[cell.row - 1][cell.column] : myMaze.grid[cell.row - 1];
  let bottomNeighbor = myMaze.grid[cell.row + 1] ? myMaze.grid[cell.row + 1][cell.column] : myMaze.grid[cell.row + 1];
  let leftNeighbor = myMaze.grid[cell.row][cell.column - 1];
  let rightNeighbor = myMaze.grid[cell.row][cell.column + 1];

  if (topNeighbor) {
    if (!onlyUnvisitedByMazeGenerator || !topNeighbor.visitedByMazeGenerator) {
      if (!wallBarrierOn || !cell.walls.topWall) {
        if (!visitedNeighborsOnly || topNeighbor.visited) {
          if (!onlyUnvisitedByDistanceAlgo || !topNeighbor.visitedByDistanceAlgo) {
            neighbors.push(topNeighbor);
          }
        }
      }
    }
  }
  if (bottomNeighbor) {
    if (!onlyUnvisitedByMazeGenerator || !bottomNeighbor.visitedByMazeGenerator) {
      if (!wallBarrierOn || !cell.walls.bottomWall) {
        if (!visitedNeighborsOnly || bottomNeighbor.visited) {
          if (!onlyUnvisitedByDistanceAlgo || !bottomNeighbor.visitedByDistanceAlgo) {
            neighbors.push(bottomNeighbor);
          }
        }
      }
    }
  }
  if (leftNeighbor) {
    if (!onlyUnvisitedByMazeGenerator || !leftNeighbor.visitedByMazeGenerator) {
      if (!wallBarrierOn || !cell.walls.leftWall) {
        if (!visitedNeighborsOnly || leftNeighbor.visited) {
          if (!onlyUnvisitedByDistanceAlgo || !leftNeighbor.visitedByDistanceAlgo) {
            neighbors.push(leftNeighbor);
          }
        }
      }
    }
  }
  if (rightNeighbor) {
    if (!onlyUnvisitedByMazeGenerator || !rightNeighbor.visitedByMazeGenerator) {
      if (!wallBarrierOn || !cell.walls.rightWall) {
        if (!visitedNeighborsOnly || rightNeighbor.visited) {
          if (!onlyUnvisitedByDistanceAlgo || !rightNeighbor.visitedByDistanceAlgo) {
            neighbors.push(rightNeighbor);
          }
        }
      }
    }
  }

  return neighbors;
}

// wrapper
function getAccessibleNeighbors(cell) {
  return getNeighbors(cell, false, true, true, false);
}

function getAllNeighbors(cell) {
  return getNeighbors(cell, false, false, false, false);
}

function getUnvisitedNeighbors(cell) {
  return getNeighbors(cell, true, false, false, false);
}

function getVisitedNeighbors(cell) {
  return getNeighbors(cell, false, false, false, true);
}

//
function getRandomCell(myMaze) {
  const cellRow = Math.floor(Math.random() * myMaze.numCells);
  const cellColumn = Math.floor(Math.random() * myMaze.numCells);

  return myMaze.grid[cellRow][cellColumn];
}

// modifies the array in place, after having removed the item (i.e. the cell)
function removeItemFromArray(arr, item) {
  let index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

// for hunt and kill: get the first unvisited cell starting from top left
// that has at least one bordering visited cell
function getFirstUnvisitedCellwithVisitedNeighbor() {
  for (let rowNum = 0; rowNum < myMaze.numCells; rowNum++) {
    for (let colNum = 0; colNum < myMaze.numCells; colNum++) {
      currentCell = myMaze.grid[rowNum][colNum];
      if (!currentCell.visited) {
        neighbors = getVisitedNeighbors(currentCell);
        if (neighbors.length > 0) {
          return currentCell;
        }
      }
    }
  }
  return null;
}
