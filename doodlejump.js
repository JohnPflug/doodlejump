// Declare some variables for the board:
let board;
let boardWidth = 360; // Background image i 640 x 1024 pixels. Width/height ratio ~ 0.625
let boardHeight = 576;
let context;

// Declare some variables for the doodler:
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = boardHeight * 7 / 8 - doodlerHeight;
let doodlerRightImage;
let doodlerLeftImage;

// Game physics:
let velocityX = 0;
let velocityY = 0; // Doodle jump speed
let initialVelocityY = -8; // Starting velocity Y, with a jump
let gravity = 0.4;

// Platforms:
let platformsArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImage;

// Create the doodler object with necessary properties:
let doodler = {
    image: null,
    width: doodlerWidth,
    height: doodlerHeight,
    x: doodlerX,
    y: doodlerY,
};

// Window onload function:
window.onload = function () {
    board = document.getElementById("board"); // Assign board variable to canvas (id = board)
    board.height = boardHeight; // Set the canvas' height attribute to boardHeight (576)
    board.width = boardWidth; // Set the canvas' width attribute to boardWidth (360)
    context = board.getContext("2d"); // Set the canvas' context to 2d.

    // Draw doodler:
    doodlerRightImage = new Image();
    doodlerRightImage.src = "assets/doodler-right.png";
    doodler.image = doodlerRightImage;
    doodlerRightImage.onload = function () {
        context.drawImage(doodler.image, doodler.x, doodler.y, doodler.width, doodler.height);
    };

    doodlerLeftImage = new Image();
    doodlerLeftImage.src = "assets/doodler-left.png";

    // Load platform images:
    platformImage = new Image();
    platformImage.src = "./assets/platform.png";

    // Game loop:
    velocityY = initialVelocityY;
    placePlatforms(); // Invoke our placePlatforms function
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
};

// Define update function:
function update() {
    requestAnimationFrame(update);

    // Clear canvas:
    context.clearRect(0, 0, board.width, board.height);

    // Draw doodler:
    doodler.x += velocityX;
    if (doodler.x > board.width) { // Let the doodler loop across the screen
        doodler.x = 0 - doodler.width;
    } else if (doodler.x + doodler.width < 0) {
        doodler.x = board.width;
    }
    velocityY += gravity;
    doodler.y += velocityY;
    context.drawImage(doodler.image, doodler.x, doodler.y, doodler.width, doodler.height);

    // Draw platforms:
    for (let i = 0; i < platformsArray.length; i++) {
        let platform = platformsArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 3 / 4) { // Check if doodler in the bottom quarter of the screen
            platform.y -= initialVelocityY; // If so, slide platforms down
        }
        if (detectCollision(doodler, platform) && velocityY > 0) {
            velocityY = initialVelocityY; // Jump off the platform
        }
        context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
    }

    // Clear platforms and create new platforms:
    while (platformsArray.length > 0 && platformsArray[0].y >= boardHeight) {
        platformsArray.shift();
        newPlatform();
    }
}

// Define moveDoodler function:
function moveDoodler(event) {
    if (event.code === "ArrowRight" || event.code === "KeyD") {
        velocityX = 4; // Move doodler to the right
        doodler.image = doodlerRightImage; // Change doodler image to right image
    } else if (event.code === "ArrowLeft" || event.code === "KeyA") {
        velocityX = -4;  // Move doodler to the left
        doodler.image = doodlerLeftImage; // Change doodler image to left image
    }
}

// Define place platforms function:
function placePlatforms() {
    platformsArray = [];

    // Starting platform:
    let platform = {
        image: platformImage,
        x: boardWidth / 2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight,
    }
    platformsArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth * 3 / 4); // Random X position for each platform
        platform = {
            image: platformImage,
            x: randomX,
            y: boardHeight - 75 * i - 150,
            width: platformWidth,
            height: platformHeight,
        }
        platformsArray.push(platform);
    }
}

// Define our collision detection function:
function detectCollision(a, b) {
    return a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x && // a's top right corner doesn't reach b's top left corner
        a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y // a's bottom left corner doesn't reach b's top left corner
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3 / 4);
    let platform = {
        image: platformImage,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight,
    }
    platformsArray.push(platform);
}