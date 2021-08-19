// Set up the canvas
const maze = document.querySelector('#myCanvas')
let ctx = maze.getContext("2d");
ctx.strokeStyle = "#000000";

const boarderSize = 3


class Maze {
    constructor(sizeInPixels, numCells) {
        this.size = sizeInPixels
        this.numCells = numCells;
        this.grid = []; //backend info on each cell in the grid; stores a cell 
    }

    // Set up grid for our backend use
    setUp() {
        for (let row = 0; row < this.numCells; row++) {
            let cellArray = [];
            for (let column = 0; column < this.numCells; column ++) {
                let cell = new Cell(row, column, this.numCells, this.size)
                cellArray.push(cell)
            }
            this.grid.push(cellArray)
        }
    }

    // Draw the cells onto the page 
    draw() {
        maze.width = this.size
        maze.height = this.size
        for (let row = 0; row < this.numCells; row++) {
            for (let column = 0; column < this.numCells; column ++) {
                this.grid[row][column].show()
            }
        }
        // draw where four cells meet so there's no weird cut
        for (let row = 0; row < this.numCells; row++) {
            for (let column = 0; column < this.numCells; column ++) {
                ctx.fillStyle = `rgb(0, 0, 0)`;
                let scale = this.size / this.numCells
                ctx.fillRect(row * scale - boarderSize / 2, column * scale - boarderSize / 2, boarderSize, boarderSize)
            }
        }
    }

    reset () {
        for (let row = 0; row < this.numCells; row++) {
            for (let column = 0; column < this.numCells; column ++) {
                let currentCell = this.grid[row][column]
                currentCell.walls.topWall = true
                currentCell.walls.rightWall = true
                currentCell.walls.bottomWall = true
                currentCell.walls.leftWall = true
                currentCell.visited = false
                currentCell.visitedByMazeGenerator = false
                currentCell.distanceFromStart = 0
                currentCell.visitedByDistanceAlgo = false
                currentCell.inPath = false
            }
        }
    }
    // apparently on most browsers you can just redraw the whole thing
    // revisit this optimization if it fails later on
    removeWalls(cellOne, cellTwo) {
        const xDiff = cellOne.column - cellTwo.column
        if (xDiff === 1) {
            cellOne.walls.leftWall = false;
            cellTwo.walls.rightWall = false;
        } else if (xDiff === -1) {
            cellOne.walls.rightWall = false;
            cellTwo.walls.leftWall = false
        }
        const yDiff = cellOne.row - cellTwo.row
        if (yDiff === 1) {
            cellOne.walls.topWall = false
            cellTwo.walls.bottomWall = false
        } else if (yDiff === -1) {
            cellOne.walls.bottomWall = false
            cellTwo.walls.topWall = false
        }
    }
}

// issue with walls looking too thin. Maybe Can have double walls initially? 
// i.e. when draw draw it twice

class Cell {
    constructor(row, column, numCells, mazeSize) {
        this.row = row
        this.column = column
        this.cellWidth = mazeSize / numCells;
        this.visited = false;
        this.walls = {
            topWall: true,
            rightWall: true,
            bottomWall: true,
            leftWall: true
        }
        this.startX = this.column * this.cellWidth
        this.startY = this.row * this.cellWidth
        this.visitedByMazeGenerator = false 
        this.distanceFromStart = 0
        this.visitedByDistanceAlgo = false
        this.inPath = false
        
    }

    // Methods to draw the walls
    drawTopWall() {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY)
        ctx.lineTo(this.startX + this.cellWidth, this.startY)
        ctx.lineWidth = boarderSize
        ctx.stroke()
    }
    drawRightWall() {
        ctx.beginPath();
        ctx.moveTo(this.startX + this.cellWidth, this.startY)
        ctx.lineTo(this.startX + this.cellWidth, this.startY + this.cellWidth)
        ctx.lineWidth = boarderSize
        ctx.stroke()
    }
    drawBottomWall() {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY + this.cellWidth)
        ctx.lineTo(this.startX + this.cellWidth, this.startY + this.cellWidth)
        ctx.lineWidth = boarderSize
        ctx.stroke()
    }
    drawLeftWall() {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY)
        ctx.lineTo(this.startX, this.startY + this.cellWidth)
        ctx.lineWidth = boarderSize
        ctx.stroke()
    }

    show() {
        if (this.inPath) {
            ctx.fillStyle = "rgb(80,80,80)";
            ctx.fillRect(this.startX, this.startY, this.cellWidth, this.cellWidth)
        }
        if (this.visited) {
            // ctx.fillStyle = "#F8F8F8";
            ctx.fillStyle = "rgb(110,110,110)";
            ctx.fillRect(this.startX, this.startY, this.cellWidth, this.cellWidth)
        }    
        if (this.visitedByDistanceAlgo) {
            ctx.fillStyle = '#F8F8F8'; // set background grey to support opacity
            ctx.fillRect(this.startX, this.startY, this.cellWidth, this.cellWidth)

            const intensity = 2 * this.distanceFromStart / (numCells ** 2) //betting very few times do we ever have a path that is 80% of total num cells
            ctx.fillStyle = `rgba(0, 0, 255, ${intensity})`;
            ctx.fillRect(this.startX, this.startY, this.cellWidth, this.cellWidth)
        }

        if (this.walls.topWall) {
            this.drawTopWall()
        }
        if (this.walls.rightWall) {
            this.drawRightWall()
        } 
        if (this.walls.bottomWall) {
            this.drawBottomWall()
        }
        if (this.walls.leftWall) {
            this.drawLeftWall()
        }
        
    }

    highlight() {
        ctx.fillStyle = "pink";
        ctx.fillRect(this.startX, this.startY, this.cellWidth, this.cellWidth)
    }

    highlightWallBreak() {
        ctx.fillStyle = "rgb(105,105,105)";
        ctx.fillRect(this.startX, this.startY, this.cellWidth, this.cellWidth)
    }
}
