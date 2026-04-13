const whatsappImages = [
    "WhatsApp Image 2026-04-13 at 00.03.35 (1).jpeg",
    "WhatsApp Image 2026-04-13 at 00.03.35.jpeg",
    "WhatsApp Image 2026-04-13 at 00.03.36 (1).jpeg",
    "WhatsApp Image 2026-04-13 at 00.03.36 (2).jpeg",
    "WhatsApp Image 2026-04-13 at 00.03.36.jpeg",
    "WhatsApp Image 2026-04-14 at 02.14.15.jpeg",
    "WhatsApp Image 2026-04-14 at 02.14.25.jpeg",
    "WhatsApp Image 2026-04-14 at 02.14.40.jpeg",
    "WhatsApp Image 2026-04-14 at 02.14.50.jpeg",
    "WhatsApp Image 2026-04-14 at 02.15.07.jpeg",
    "WhatsApp Image 2026-04-14 at 02.15.18.jpeg",
    "WhatsApp Image 2026-04-14 at 02.15.27.jpeg",
    "WhatsApp Image 2026-04-14 at 02.15.34.jpeg",
    "WhatsApp Image 2026-04-14 at 02.15.42.jpeg",
    "WhatsApp Image 2026-04-14 at 02.15.50.jpeg",
    "WhatsApp Image 2026-04-14 at 02.16.01.jpeg"
];

let bgScroll;
let scoreText;
let gameOverOverlay;
let uiLayer;
let dedicatedNoteScreen;
let memoriesFoundElement;
let hasWon = false;
let WIN_SCORE;
const SCORE_PER_IMAGE = 500; // Reduced from 1500 so they appear closer together

//board
let board;
let boardWidth = 650;
let boardHeight = 700;
let context;

//dino
let dinoWidth = 64;
let dinoHeight = 64;
let dinoX = boardWidth/2;
let dinoY = boardHeight/2;
let dinoImg;
let n_pImg;
let m_pImg;
let d_pImg;
let imgArray = [];

// platform
let platformArray = [];
let platformWidth = 102;
let platformDistance = boardHeight;
let platformX;
let nextDistance = -80;
let platformY;
let platformHeight =18;
// physics

let DinoXVeclocity = 0; 
let DinoYVelocity = 12;
let platformYvelocity = 0;
let platformXvelocity = 0;
let gravity = 0.5;
let flightstate = false;
let gameOver = false;
let score = 0;
let dino = {
    x: dinoX,
    y: dinoY,
    height: dinoHeight,
    width: dinoWidth,
};



document.addEventListener('DOMContentLoaded', () =>{
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    bgScroll = document.getElementById('background-scroll');
    scoreText = document.getElementById('score-text');
    gameOverOverlay = document.getElementById('game-over-overlay');
    uiLayer = document.getElementById('ui-layer');
    dedicatedNoteScreen = document.getElementById('dedicated-note-screen');
    memoriesFoundElement = document.getElementById('memories-found');
    
    // Set win score to trigger right after the last photo
    WIN_SCORE = (whatsappImages.length * SCORE_PER_IMAGE) + 300; 

    initializeBackground();

    dinoImg = new Image();
    dinoImg.src = "./images/dino (2).png";
    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }
    n_pImg = new Image();
    n_pImg.src = "./images/platform.png"
    m_pImg = new Image();
    m_pImg.src = "./images/moving_platform.png"
    d_pImg = new Image();
    d_pImg.src = "./images/dis_platform.png"
    
    // Reduced difficulty: 60% normal, 20% disappearing, 20% moving
    imgArray.push(['n',n_pImg]);
    imgArray.push(['n',n_pImg]);
    imgArray.push(['n',n_pImg]);
    imgArray.push(['d', d_pImg]);
    imgArray.push(['m', m_pImg]);
    placePlatforms()
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keyup", stopDino);

});

function update(){
    if (hasWon) return; // Stop the physics loop once won
    
    requestAnimationFrame(update);
    if (score >= WIN_SCORE && !hasWon) {
        hasWon = true;
        // Fade out game rendering
        uiLayer.style.opacity = '0';
        board.style.opacity = '0';
        
        // Show the beautiful final note screen
        dedicatedNoteScreen.classList.remove('hidden-screen');
        return; // Freeze immediately
    }

    if (dino.y > boardHeight){
        gameOver =  true;
        }
    if (platformArray.length < 10){
        placePlatforms()
    }
    context.clearRect(0, 0, board.width, board.height);
    if(gameOver){
        gameOverOverlay.classList.remove('hidden');
        platformArray = [];
    } else {
        gameOverOverlay.classList.add('hidden');
    }
    if(dino.y <= boardHeight/2){
        dino.y = boardHeight/2;
            platformYvelocity = DinoYVelocity;
            score += Math.round(Math.abs(platformYvelocity));
            scoreText.innerText = score.toString();
            bgScroll.style.transform = `translateY(${score}px)`;
            
            if (memoriesFoundElement) {
                let unlocked = Math.floor(score / SCORE_PER_IMAGE);
                if (unlocked > whatsappImages.length) unlocked = whatsappImages.length;
                memoriesFoundElement.innerText = unlocked.toString();
            }
           }
    else{
        platformYvelocity = 0;
    }
    if (dino.x > boardWidth){
        dino.x = 0;
    }
    if (dino.x + dinoWidth < 0){
        dino.x = boardWidth - dinoWidth;
    }
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        
        if (platform.type ==  'm'){
            
            if (platform.Xvelocity === 0){
                platform.Xvelocity = Math.random() * 4 +1;
            }
            if (platform.x + platformWidth >= boardWidth){
                
                platform.Xvelocity = -platform.Xvelocity;
                platform.x = boardWidth - platformWidth;
            }
            if (platform.x <= 0){
                platform.Xvelocity = -platform.Xvelocity;
                platform.x = 0;
            }

            platform.x += platform.Xvelocity 
        }
        platform.y += platformYvelocity;
        if (detectCollision(platform)){
            if (platform.type === 'd'){
            platformArray.splice(i,1)}
            DinoYVelocity = 13;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);}
    if (platformArray[0].y > boardHeight){
        console.log(platformArray[0].y)
        platformArray.shift();
    }
    DinoYVelocity -= gravity;
    dino.y -= DinoYVelocity;
    dino.x += DinoXVeclocity;
}


function placePlatforms(){
    if (platformArray.length != 0){
        platformDistance = platformArray[platformArray.length-1].y -80
    }
    for( let i = 0; i < 20; i++){
    const randomIndex = Math.floor(Math.random() * imgArray.length);
    let platformImg =  imgArray[randomIndex][1];
    platformY = platformDistance;
    platformDistance += nextDistance;
    platformX = Math.random() * (boardWidth - platformWidth);
    let platform = {
        x: platformX,
        y: platformY,
        Xvelocity: 0,
        width: platformWidth,
        height: platformHeight,
        img: platformImg,
        type: imgArray[randomIndex][0]
    }
    platformArray.push(platform)
    }

}

function initializeBackground() {
    let currentY = -500; // Start the first photo 500px above
    
    // Add photos
    whatsappImages.forEach((imgSrc) => {
        let wrapper = document.createElement('div');
        wrapper.className = 'photo-wrapper';
        
        let leftPos = Math.random() * (boardWidth - 350) + 20;
        let rotation = (Math.random() * 30) - 15;
        
        wrapper.style.top = `${currentY}px`;
        wrapper.style.left = `${leftPos}px`;
        wrapper.style.transform = `rotate(${rotation}deg)`;
        
        let frame = document.createElement('div');
        frame.className = 'photo-frame';
        
        let img = document.createElement('img');
        img.src = `./images/${imgSrc}`;
        img.style.width = '240px';
        img.style.height = 'auto'; // Maintain aspect ratio
        
        frame.appendChild(img);
        wrapper.appendChild(frame);
        bgScroll.appendChild(wrapper);
        
        currentY -= SCORE_PER_IMAGE;
    });
}

function detectCollision(platform){
    if (dino.y + dinoHeight >= platform.y && dino.y + dinoHeight <= platform.y + platformHeight && DinoYVelocity < 0) {
        // Check if the dino is within the horizontal bounds of the platform
        if ((dino.x + dinoWidth <= platform.x + platformWidth || dino.x <=  platform.x + platformWidth) && dino.x + dinoWidth >= platform.x) {
            return true;
        }
    }
    return false;
}

function moveDino(e) {
    if (gameOver === true){
        placePlatforms();
        dino.y = dinoY;
        dino.x = dinoX;
        platformDistance = boardHeight;
        DinoYVelocity = 12;
        platformArray = [];
        score = 0;
        scoreText.innerText = score.toString();
        if (memoriesFoundElement) memoriesFoundElement.innerText = "0";
        bgScroll.style.transform = `translateY(0px)`;
        gameOverOverlay.classList.add('hidden');
        gameOver = false;
    }
    if (e.code == "ArrowRight") {
        //right
        DinoXVeclocity = 7;
 
    }
    if (e.code == "ArrowLeft") {
        //LEFT
        DinoXVeclocity = -7;
 
    }
}

function stopDino(e) {
    if (e.code == "ArrowRight" || e.code == "ArrowLeft") {
        //stop
        DinoXVeclocity = 0;
 
    }
}