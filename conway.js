//Game of Life
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
}

function make3DArray(cols, rows, layers) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
            for (let j = 0; j < arr.length; j++) {
                arr[i][j] = new Array(layers);
            }
        }
    return arr;

}

function countNeighbors(grid, x, y, z) {
    let sum = 0;
    
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            for (let k = -1; k < 2; k++) {
                    let col = (x + i + boardWidth) % boardWidth;
                    let row = (y + j + boardHeight) % boardHeight;
                    let slice = (z + k + boardDepth) % boardDepth;

                    sum += grid[col][row][slice];
            }
        }
    }
    sum -= grid[x][y][z];
    return sum;
}
        
function setup(boardWidth, boardHeight, boardDepth) {
    let board = make3DArray(boardWidth, boardHeight, boardDepth);
    
    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            for (let k = 0; k < boardDepth; k++) {
                board[i][j][k] = Math.floor(Math.random() * 2);
            }
        }
    }
    return board;
}
function nextGeneration(board, boardWidth, boardHeight, boardDepth) {
    let next = make3DArray(boardWidth, boardHeight, boardDepth);

    for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
            for (let k = 0; k < boardDepth; k++) {
                let state = board[i][j][k];
                let neighbors = countNeighbors(board, i, j, k);

                //GAME RULES
                if (state == 0 && neighbors == 6) {
                    next[i][j][k] = 1;
                } else if (state == 1 && (neighbors < 3 || neighbors > 8)) {
                    next[i][j][k] = 0;
                } else {
                    next[i][j][k] = state;
                }
            }
        }
    }

    return next;
}

// Loop through board and create boxes
function placeObjects(boardWidth, boardHeight, boardDepth) {
    for (var x = 0; x < boardWidth; x++) {
        for (var y = 0; y < boardHeight; y++) {
            for (var z = 0; z < boardDepth; z++) {
                // Create a mesh for each box
                if (board[x][y][z] == 1) {
                    var cube = new THREE.Mesh(geometry, material);
            
                    // Position each box based on its index in the matrix
                    cube.position.x = x * spacing;
                    cube.position.y = y * spacing;
                    cube.position.z = z * spacing;

                    scene.add(cube);

                }
            }
        }   
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Update camera position to rotate around the boxes
    camera.position.x = radius * Math.sin(angle);
    camera.position.y = 20;
    camera.position.z = radius * Math.cos(angle);
    camera.lookAt(new THREE.Vector3(0,25,0));

    // Increment the angle for the next frame
    angle += 0.001;

    // Render the scene
    renderer.render(scene, camera);
}

function updateGameBoard() {
    scene.remove.apply(scene, scene.children);
    placeObjects(boardWidth, boardHeight, boardDepth);
    // Update the game board logic here
    board = nextGeneration(board, boardWidth, boardHeight, boardDepth);
}


// Initialize Three.js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// box properties
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Matrix dimensions
var boardWidth = 30;
var boardHeight = 30;
var boardDepth = 30;
var spacing = 2;

//Generate game board
board = setup(boardHeight, boardHeight, boardDepth);

// Initialize variables for camera rotation
var angle = 90;
var radius = 110;


setInterval(updateGameBoard, 1000);

animate();