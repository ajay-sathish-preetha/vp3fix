//Create variables here
var dog,dogImage,dogHappy;
var database,foodStock;
var foodS,feedPet,addFood;
var fedTime,lastFed;
var foodObj,readgameState,changeGameState;
var bedroom,garden,washroom,sadDog;
var currentTime;
function preload()
{
  dogImage = loadImage("Dog.png");
  dogHappy = loadImage("happydog.png");
  bedroom = loadImage("Bedroom.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Washroom.png");
  sadDog = loadImage("Lazy.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000, 500);
  foodObj = new Food();
 foodStock=database.ref("Food");
  foodStock.on("value",readStock);

  gameState=database.ref('gameState');
  gameState.on("value",function(data){
          gameState=data.val();
  })

  
  dog = createSprite(810,200,10,10);
  dog.addImage(dogImage);
  dog.scale = 0.2;


  feedPet = createButton("Feed The Dog");
  feedPet.position(700,95);
  feedPet.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  
  background(46,169,169)
  //add styles here
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+lastFed%12 + "PM", 350,30);

  }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);

  }else{
    text("Last Feed : "+lastFed + "AM",350,30);
  }

   currentTime=hour();
   if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     update("Sleeping")
     foodObj.bedroom();
   } else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4) ){
     update("Bathing");
     foodObj.washroom();
   }else{
     update("Hungry");
     foodObj.display();
   }

   if(gameState!=="Hungry"){
    feedPet.hide();
   addFood.hide();
   dog.remove();
   }else{
  feedPet.show();
  addFood.show();
  dog.addImage(dogImage);
  }


 drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
     FeedTime:hour(),
     gameState:"Hungry"
  })
}

function  addFoods(){
   foodS++;
   database.ref('/').update({
     Food:foodS
   })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}


