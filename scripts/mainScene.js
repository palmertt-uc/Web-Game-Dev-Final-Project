class mainScene extends Phaser.Scene {
  // The 3 methods
  constructor(){
    super("runGame");
  }
  preload() {
    // This method is called once at the beginning
    // It will load all the assets, like sprites and sounds  
    // Parameters: name of the sprite, path of the image
    this.load.image('package', 'assets/sprites/package.png');
    this.load.image('cincinnati', 'assets/images/Cincinnati.png');
    this.load.image('chicago', 'assets/images/Chicago.PNG');
    this.load.image('houston', 'assets/images/Houston.PNG');
    this.load.image('losangeles', 'assets/images/LosAngeles.PNG');
    this.load.image('miami', 'assets/images/Miami.PNG');
    this.load.image('newyork', 'assets/images/NewYork.PNG');
    this.load.image('house', 'assets/sprites/House.png');
    this.load.image('warehouse', 'assets/sprites/Warehouse.png');

    this.load.spritesheet("drone","assets/sprites/DroneAnimated.png",{
      frameWidth:32,
      frameHeight:32
    });
  }
  create() {
    console.log(this.scene.get(`startScreen`).keyPressed);
    // Sets the background image to one of Cincinnati
    switch(this.scene.get(`startScreen`).keyPressed){
      case 1:
        this.background = this.add.tileSprite(0, 0, 1200, 600, "cincinnati");
        break;
      case 2:
        this.background = this.add.tileSprite(0, 0, 1200, 600, "chicago");
        break;
      case 3:
        this.background = this.add.tileSprite(0, 0, 1200, 600, "houston");
        break;
      case 4:
        this.background = this.add.tileSprite(0, 0, 1200, 600, "losangeles");
        break;
      case 5:
        this.background = this.add.tileSprite(0, 0, 1200, 600, "miami");
        break;
      case 6:
        this.background = this.add.tileSprite(0, 0, 1200, 600, "newyork");
        break;
      default:
        this.background = this.add.tileSprite(0, 0, 1200, 600, "cincinnati");
    }

    this.background.setOrigin(0, 0);
    // Gets the weather type
    fetch('https://api.openweathermap.org/data/2.5/weather?q=Cincinnati&appid=86b3ece53e58debf043613f6fc7f7cca')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let weather = data['weather'][0]['main']

            if (weather == 'Clouds') {
              document.getElementById("weatherImage").setAttribute('src', '/assets/images/cloudy.png' );
              document.getElementById("weatherText").innerHTML = "It is currently cloudy"
          } else if (weather == 'Thunderstorm') {
              document.getElementById("weatherImage").setAttribute('src', '/assets/images/thunder.png' );
              document.getElementById("weatherText").innerHTML = "It is currently thundering"
          } else if (weather == 'Drizzle') {
              document.getElementById("weatherImage").setAttribute('src', '/assets/images/rain.png' );
              document.getElementById("weatherText").innerHTML = "It is currently raining"
          } else if (weather == 'Rain') {
              document.getElementById("weatherImage").setAttribute('src', '/assets/images/rain.png' );
              document.getElementById("weatherText").innerHTML = "It is currently raining"
          } else if (weather == 'Snow') {
              document.getElementById("weatherImage").setAttribute('src', '/assets/images/snow.png' );
              document.getElementById("weatherText").innerHTML = "It is currently snowing"
          } else if (weather == 'Clear') {
              document.getElementById("weatherImage").setAttribute('src', '/assets/images/sunny.png' );
              document.getElementById("weatherText").innerHTML = "It is a clear day"
          } else {
              return "Not Available"
          }
      })

        .catch(err => alert("Open Weather API Not Working"))

    // Spawns the warehouse and house initial location
    this.warehouse = this.physics.add.sprite(400, 500, "warehouse");
    this.house = this.physics.add.sprite(1000, 200, "house")
    // This method is called once, just after preload()
    // It will initialize our scene, like the positions of the sprites
    // Parameters: x position, y position, name of the sprite
    //this.player = this.physics.add.sprite(100, 100, 'player');
    //this.coin = this.physics.add.sprite(300, 300, 'coin');
    this.package = this.physics.add.sprite(405, 500, 'package');
    this.package.setCollideWorldBounds(true);
    // Store the score in a variable, initialized at 0
    this.score = 0;
    this.arrow = this.input.keyboard.createCursorKeys();
    this.scaleMult = 2;
    // The style of the text 
    // A lot of options are available, these are the most important ones
    let style = { font: '30px Arial', fill: 'black' };

    // Display the score in the top left corner
    // Parameters: x position, y position, text, style
    this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

    this.anims.create({
      key: "drone_anim",
      frames: this.anims.generateFrameNumbers("drone"),
      frameRate: 20,
      repeat: -1
    });
    this.player = this.physics.add.sprite(350,100,"drone");
    this.player.play("drone_anim");
    this.player.setScale(this.scaleMult);
    this.player.setCollideWorldBounds(true);
    this.holding = false;
    this.setDown = false;
    this.holdInput = false;
    this.transitionTime = 200;
  }

  update() {
    let speed = 3*this.scaleMult;
    // This method is called 60 times per second after create() 
    // It will handle all the game's logic, like movements
    // Handle horizontal movements
    if (this.arrow.right.isDown) {
      // If the right arrow is pressed, move to the right
      this.player.x += speed;
  } else if (this.arrow.left.isDown) {
      // If the left arrow is pressed, move to the left
      this.player.x -= speed;
  } 

    // Do the same for vertical movements
    if (this.arrow.down.isDown) {
      this.player.y += speed;
    } else if (this.arrow.up.isDown) {
      this.player.y -= speed;
    } 


    // document.addEventListener('keydown',(event)=>{
    //   //console.log(event.key);
    //   if(event.key ==" "){
    //     this.descendAscend();
    //     if (this.physics.overlap(this.player, this.package)) {
    //       // Call the new hit() method
    //       this.hit();
    //     }
    //   }
    // })
    if(this.arrow.space.isDown && !this.holdInput){
      this.holdInput = true;
      //console.log("space");
      this.descendAscend();
      if (this.physics.overlap(this.player, this.package) || this.holding) {
        // Call the new hit() method
        this.hit();
      }
    }

    if(this.holdInput){
      // console.log("running");
      this.inputHoldTimer();
    }
    if(this.setDown){
      // console.log("running");
      this.setDownTimer();
    }

    if(this.holding){
      this.movePackage(speed);
    }
    //console.log(this.holding);
    if (this.setDown && this.physics.overlap(this.house, this.package)) {
      this.randomizeLocations()
      // Increment the score by 10
      this.score += 10;
      // Display the updated score on the screen
      this.scoreText.setText('score: ' + this.score);
    }
  } //End of update

  // Randomizes the location of the house and resets the package spawn point
  randomizeLocations() {
    this.house.x = Phaser.Math.Between(100, 1000);
    this.house.y = Phaser.Math.Between(100, 500);
    this.package.x = 405;
    this.package.y = 500;
  }

  async hit() {
    
    if(this.holding){
      this.holding = false;
      this.setDown = true;
      this.descendAscend();
      this.putDownPackage();
    }else if(!this.holding && !this.setDown){
      this.descendAscend();
      await new Promise(r => setTimeout(r, this.transitionTime));
      this.pickUpPackage();
    }
  }
  async descendAscend(){
    this.tweens.add({
      targets: this.player, // on the player 
      duration: this.transitionTime, // for 200ms 
      scaleX: 1.2, // I set the sprite a scale of 2 by default so this scales is down by 80% on the vertical axis 
      scaleY: 1.2, // I set the sprite a scale of 2 by default so this scales is down by 80% on the horizonatal axis
      yoyo: false, // Turned off because it was not working
    });
    await new Promise(r => setTimeout(r, this.transitionTime));
    this.tweens.add({
      targets: this.player, // on the player 
      duration: this.transitionTime, // for 200ms 
      scaleX: 2, // I set the sprite a scale of 2 by default so this returns the sprite to it's original size 
      scaleY: 2, // I set the sprite a scale of 2 by default so this returns the sprite to it's original size
      yoyo: false, // Turned off because it was not working
    });
  }
  

  movePackage(speed){
    if (this.arrow.right.isDown) {
      // If the right arrow is pressed, move to the right
      this.package.x += speed;
  } else if (this.arrow.left.isDown) {
      // If the left arrow is pressed, move to the left
      this.package.x -= speed;
  } 

    // Do the same for vertical movements
    if (this.arrow.down.isDown) {
      this.package.y += speed;
    } else if (this.arrow.up.isDown) {
      this.package.y -= speed;
    } 
    // this.package.x = Phaser.Math.Between(100, 1300);
    // this.package.y = Phaser.Math.Between(100, 500);
  }
  
  pickUpPackage(){
    this.holding = true;
    this.tweens.add({
      targets: this.package, // on the player 
      duration: this.transitionTime, // for 200ms 
      scaleX: 1.8, // Increase scale by 80% on the vertical axis
      scaleY: 1.8, // Increase scale by 80% on the horizontal axis
      yoyo: false, // at the end, do not go back to original scale 
    });
  }

  putDownPackage(){
    this.holding = false;
    this.tweens.add({
      targets: this.package, // on the player 
      duration: this.transitionTime, // for 200ms 
      scaleX: 1, // Return the vertical scale to default 
      scaleY: 1, // Return the horizontal scale to default 
      yoyo: false, // Unsure if I need to define this here or not. Too lazy to check. 
    });
  }
  
  async timer(){
    var sec = 30;
    var timer = setInterval(function(){
        document.getElementById('TimerDisplay').innerHTML='00:'+sec;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
        }
    }, 1000);
}
  
  async setDownTimer(){
    await new Promise(r => setTimeout(r, 1000));
    this.setDown = false;
  }
  async inputHoldTimer(){
    //console.log(this.holdInput);
    await new Promise(r => setTimeout(r, 1000));
    this.holdInput = false;
    //console.log(this.holdInput);
  }
}