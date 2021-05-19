//Create variables here
var dog, dogImg, happyDodImg, database, foods, foodStockRef,database;
var feed, addFood,fedTime,lastFed,foodObj
var currentTime, milk,input,name;
var frameCountNow = 0;
var gameState = "hungry";
var gameStateRef;
var input, button;
var bedroomImg, gardenImg, washroomImg, sleepingImg, runImg;

function preload()
{
	//load images here
  dogImg = loadImage("images/dogImg1.png");
  happyDog = loadImage("images/dogImg.png");
  bedroomImg = loadImg("images/bed Room.png")
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png ");
  sleepingImg = loadImage("images/Lazy.png");
  runImg = loadImage("images/running.png");
}


function setup() {  
  database = firebase.database();
createCanvas(1200,500);


foodObj = new Food();

dog = createSprite(width/2+250,height/2,10,10);
dog.addAnimation("hungry",hungryDog);
dog.scale = 0.3;
dog.addAnimation("happy",happyDog)
dog.addAnimation("sleeping",sleepingImg);
dog.addAnimation("run",runImg);

getGameState();

feed = createSprite("Feed the Dog")
feed.position(1050,95);
feed.mousePressed(feedDog);

addFood = createButton("Add Food")
addFood.position(800,95);
addFood.mousePressed(addfoods);
  
input = createInput("Prt name");
input.position(950,120);

button = createButton("Confirm");
button.position(1000,145);
button.mousePressed(createName);

}
function draw() {
currentTime = hour();
if(currentTime === lastFed + 1){
  gameState  = "playing";
  updateGameState();
  foodObj.garden();

}

else if(currentTime === lastFed +2){
gameState = "sleeping";
updateGameState();
foodObj.bedroom();
}

else if(currentTime > lastFed +2 && currentTime <= lastFed +4){
  gameState = "bathing";
  updateGameState();
  foodObj.washroom();
}

else{
  gameState = "hungry";
  updateGameState();
  foodObj.washroom();
}

//console.log(gameState);

foodObj.getFoodStock();
//console.log(foodStock);
getGameState();



  fedTime = database.ref("FeedTime");
  fedTime.on("value",function(data){
  lastFed = data.val();
  })

  if(gameState==="hungry"){
    feed.show();
    addFood.show();
    dog.addAnimation("hungry",hungryDog);
  }

  else{
    feed.hide();
    addFood.hide();
    dog.remove();
  }

  drawSprites();
  //add styles here
  textSize(32);
  fill('red');
  //text ("press the ip arrow key to feed the the dog!",width/2-200,100);
  text("time science last fed: "+(currentTime- lastFed),300,125);

  function feedDog(){
    foodObj.deductFood();
    foodObj.updateFoodStock();
  }
  function addFood(){
    foodObj.addFood();
    foodObj.updateFoodStock();
  }
  async function hour(){
 var site = await fetch();
 var siteJSON = await site.json();
 var datetime = siteJSON.datetime;
 var hourTime = datetime.slice(11,13);
 return hourTime;
  }
  function createName(){
    input.hide();
    button.hide();

    name = input.value();
    var greeting = createElement("h3");
    greeting.html("Pet's name:"+name);
    greeting.position(width/2+850,height/2+200);
  }
  function updateGameState(){
    database.ref('/').update({
      gameState:gameState
    })
  }

}