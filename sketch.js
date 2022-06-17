var PLAY=1
var END=0
var gameState=PLAY
var retry,retryImg;
var gameover,gameoverImg;
var score;
var coin;
var thief,thief_running,thief_fade;
var path,pathImg
var invisibleground;

var coin,coinImg
var obstacle1;
var obstacle2;


function preload(){

    thief_running=loadAnimation("thief.run1.png","thief.run2.png","thief.run3.png","thief.run4.png");
    thief_collided=loadAnimation("thief.collide2.png");
    pathImg=loadImage("image.png");
    coinImg=loadAnimation("coin1.png","coin2.png","coin3.png","coin4.png","coin5.png","coin6.png");
    obstacle1=loadImage("police_obstacle1.png");
    obstacle2=loadImage("police_obstacle2.png");
    retryImg=loadImage("retry.png");
    gameoverImg=loadImage("gameover.png")
}

function setup(){

createCanvas(600,200)
   
   
    path=createSprite(200,100,10,10)
    path.addImage("background",pathImg)
    path.scale=0.5

    thief=createSprite(200,150,10,10)
    thief.addAnimation("running",thief_running);
    thief.addAnimation("collided",thief_collided)
    thief.scale=0.5

    invisibleground=createSprite(200,190,500,20)
    invisibleground.visible=false
    // creating gameover and retry sprites
    gameover=createSprite(300,95)
    gameover.addImage(gameoverImg);
    gameover.scale=0.5

    retry = createSprite(300,140);
    retry.addImage(retryImg);
    retry.scale=0.1
  

    

    //creating obstacles and coins group
    obstaclesGroup=new Group()
    coinsGroup=new Group()

    score=0
    coin=0
    thief.debug=false
    thief.setCollider("rectangle",0,0,thief.width,thief.height);
}

function draw() {
    background(0)

    
    
    console.log(gameState)
  
    if(gameState===PLAY){

        retry.visible=false
        gameover.visible=false
        //scoring
        score = score + Math.round(getFrameRate()/60);
    
        if(keyDown("space")&&thief.y>=161){
            thief.velocityY=-15
        }
       
        
        //adding gravity
        thief.velocityY=thief.velocityY+0.8
        //creating infinite path
        path.velocityX=-5

        if (path.x < 0){
            path.x = path.width/4;
      }

        //code to spawn obstacles and coins
        spawnObstacles()
        spawnCoins()

        if(obstaclesGroup.isTouching(thief)){
            gameState=END
            

     }

    }

    else if (gameState === END) {
       
        retry.visible = true;
        gameover.visible=true;
        path.velocityX = 0;

        //change animation of the thief
        thief.changeAnimation("collided",thief_collided)
        
        if(mousePressedOver(retry)) {
          reset();
        }


   
   
}
 //making thief to collide of invisible ground
 thief.collide(invisibleground)

    
 drawSprites()
 if(thief.isTouching(coinsGroup)){
    coinsGroup.destroyEach()
    coin+=1
}
 text("Score: "+ score, 500,20);
 text("CoinsCollected:"+coin,500,35)
}

function reset(){
    gameState=PLAY
  
  retry.visible=false
  gameover.visible=false
  obstaclesGroup.destroyEach()
  coinsGroup.destroyEach()
  thief.changeAnimation("running",thief_running)
  score=0;
  coin=0;
  thief.y=163
  }

function spawnObstacles(){
//code to spawn obstacles
    if(frameCount % 60 ===0){

        var obstacle=createSprite(600,165,10,40);
        obstacle.velocityX=-6

        //generating random obstacles
        var rand=Math.round(random(1,2))
        switch(rand){
            case 1:obstacle.addImage(obstacle1);
            break;
            case 2:obstacle.addImage(obstacle2);
            break;
            default:break;
        }

        //adding obstacle to the group
        obstaclesGroup.add(obstacle)
        //guving a lifetime to the obstacles
        obstacle.lifetime=300
    }

    
}

function spawnCoins(){
    //code to spawn coins
    if(frameCount%120===0){
        var coins = createSprite(600,100,40,10);
        coins.y = Math.round(random(80,100));
        coins.addAnimation("coin",coinImg);
        coins.scale = 0.1;
        coins.velocityX = -3;
    
        //giving lifetime to the coins
        coins.lifetime=300

        //adjusting the depth
        coins.depth=thief.depth
        thief.depth=thief.depth+1;

        //adding coins to the group
        coinsGroup.add(coins)

        
    }
}