//cria as variaveis
var t_rex,t_rexRunning,t_rexCollided;
var canvas;
var ground, ground_img, invisibleGround;
var cloud, cloud_img,cloud_gp;
var cacto, cacto_img01,cacto_img02,cacto_img03,cacto_img04,cacto_img05,cacto_img06,cacto_gp;
var score = 0;
var record = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, gameOver_img,restart,restart_img;
var die_song, jump_song, score_song;

//carrega toda as midias
function preload(){
   t_rexRunning = loadAnimation("trex3.png","trex4.png");
   t_rexCollided = loadAnimation("trex_collided.png");
   ground_img = loadImage("ground2.png");

   cloud_img = loadImage("cloud.png");

   cacto_img01 = loadImage("obstacle1.png");
   cacto_img02 = loadImage("obstacle2.png");
   cacto_img03 = loadImage("obstacle3.png");
   cacto_img04 = loadImage("obstacle4.png");
   cacto_img05 = loadImage("obstacle5.png");
   cacto_img06 = loadImage("obstacle6.png");

   gameOver_img = loadImage("gameOver.png");
   restart_img = loadImage("restart.png");

   die_song = loadSound("die.mp3");
   score_song = loadSound("checkPoint.mp3");
   jump_song = loadSound("jump.mp3");


}

//configuração do jogo
function setup(){
    canvas = createCanvas(600,200);

    t_rex = createSprite(50,150,20,30);
    t_rex.addAnimation("run",t_rexRunning);
    t_rex.addAnimation("collided",t_rexCollided);
    t_rex.scale = 0.5;

    ground = createSprite(300,180,600,20);
    ground.addImage("solo", ground_img);
    

    invisibleGround = createSprite(300,190,600,10);
    invisibleGround.visible = false;

    cloud_gp = new Group();
    cacto_gp = new Group();

    gameOver = createSprite(300,90,30,10);
    restart = createSprite(300,120,30,10);

    gameOver.addImage(gameOver_img);
    restart.addImage(restart_img);

    gameOver.scale = 0.5;
    restart.scale = 0.5;

    gameOver.visible=false;
    restart.visible=false;

    //t_rex.debug = true;
    t_rex.setCollider("circle",0,0,30);

}


function draw(){
    background("white");

    if (t_rex.isTouching(cacto_gp)) {
        gameState = END;
        t_rex.changeAnimation("collided",t_rexCollided);
        //die_song.play();
    }

    //pontuação
    text("Score: "+score,500,20);
    //record
    //faça aqui o text para o record
    text("Record: "+record,420,20);


    if (gameState === PLAY) {
        //pulo do trex
        if (keyDown("space") && t_rex.y >=150) {
            t_rex.velocityY = -10;
            jump_song.play();
        }

        score = Math.round(frameCount/2);

        if (score >0 && score%100 === 0) {
            score_song.play();
        }


        //reiniciando o solo
        if(ground.x < 0){
            ground.x = ground.width/2;
        }

        ground.velocityX = -(2+score/100);

        spawnClouds();
        spawnObs();

        
    }

    if (gameState === END) {
        //colocar aqui o que acontece quando o jogo pára.
        cloud_gp.setVelocityXEach(0);
        cacto_gp.setVelocityXEach(0);
        cloud_gp.setLifetimeEach(-1);
        cacto_gp.setLifetimeEach(-1);
        ground.velocityX = 0;
        gameOver.visible=true;
        restart.visible=true;
        if(score > record){
            record = score;
        }
    }
    gravity();
    console.log(gameState);
    
    //colisão do trex com o solo
    t_rex.collide(invisibleGround);
    

    drawSprites();
}

//funções

function gravity() {
    t_rex.velocityY = t_rex.velocityY+0.5;
}

function spawnClouds(){
    if(frameCount%90 === 0){
        cloud = createSprite(600,100,20,10);
        cloud.addImage(cloud_img);
        cloud.velocityX = -(2+score/100);
        cloud.y = random(20,100);
        cloud.scale = random(0.2,1)
        cloud.lifetime = 300;
        cloud.depth = t_rex.depth -1;
        cloud_gp.add(cloud);
    }
}
function spawnObs(){
    if(frameCount%120 === 0){
        cacto = createSprite(600,170,10,30);

        var sorteio = Math.round(random(1,6));
        switch (sorteio) {
            case 1: cacto.addImage(cacto_img01);
            cacto.scale = 0.4;
                break;
            case 2: cacto.addImage(cacto_img02);
            cacto.scale = 0.4;
                break;
            case 3: cacto.addImage(cacto_img03);
            cacto.scale = 0.4;
                break;
            case 4: cacto.addImage(cacto_img04);
            cacto.scale = 0.4;
                break;
            case 5: cacto.addImage(cacto_img05);
            cacto.scale = 0.4;
                break;
            case 6: cacto.addImage(cacto_img06);
            cacto.scale = 0.3;
                break;
        }



        cacto.velocityX = -(2+score/100);
        //cloud.y = random(20,100);
        
        cacto.lifetime = 300;
        cacto.depth = t_rex.depth -1;
        cacto_gp.add(cacto);
    }
}