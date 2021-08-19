// BFS expands outwards from starting cell, assigning to each cell dist from start
// modifies the cells inside our maze
async function assignDistanceFromStart(startCell) {
  console.log("coloring in maze...");
  let currDist = 0;
  let currentlyVisiting = [startCell];
  let toVisit = [];

  while (currentlyVisiting.length > 0) {
    currentCell = currentlyVisiting.pop();
    currentCell.distanceFromStart = currDist;
    currentCell.visitedByDistanceAlgo = true;

    unvisitedNeighbors = getAccessibleNeighbors(currentCell);
    toVisit.push(...unvisitedNeighbors);

    if (currentlyVisiting.length == 0) {
      currentlyVisiting.push(...toVisit);
      toVisit = [];
      currDist += 1;
      await new Promise((r) => setTimeout(r, timeDelay));
    }
    await new Promise((r) => setTimeout(r, timeDelay));
    myMaze.draw();
  }
}
