

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
    imgArray.push(['n',n_pImg]);
    imgArray.push(['d', d_pImg]);
    imgArray.push(['m', m_pImg]);
    placePlatforms()
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keyup", stopDino);

});

function update(){
    requestAnimationFrame(update);
    if (dino.y > boardHeight){
        gameOver =  true;
        }
    if (platformArray.length < 10){
        placePlatforms()
    }
    context.clearRect(0, 0, board.width, board.height);
    if(gameOver){
        context.fillStyle = "white";
        context.font="50px sans-serif";
        context.fillText("Game Over", boardWidth/2-150, boardHeight/2);
        context.fillText("Press Any Key To Restart", boardWidth/2-280, boardHeight/2+80);
        platformArray = [];
    }
    if(dino.y <= boardHeight/2){
        dino.y = boardHeight/2;
            platformYvelocity = DinoYVelocity;
            score += Math.round(Math.abs(platformYvelocity));
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
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);
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