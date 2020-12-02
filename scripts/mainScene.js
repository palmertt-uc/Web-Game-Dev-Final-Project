class mainScene extends Phaser.Scene {
  // The 3 methods
  constructor() {
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

    this.load.spritesheet("drone", "assets/sprites/DroneAnimated.png", {
      frameWidth: 32,
      frameHeight: 32
    });

    this.load.spritesheet("bird", "assets/sprites/bird.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
  }
  create() {
    this.counter = 30;
    this.deltaTimer = 0;
    this.gameOver = false;

    this.startTime = this.getTime();
    this.hurtTimer = 0;
    this.shovex = 0;
    this.shovey = 0;

    let instructionID = document.getElementById('instructions');
    instructionID.innerHTML = "Move using the arrow keys. Pick up/Drop off packages with Space bar!";
    let instructionID2 = document.getElementById('instructions2');
    instructionID2.innerHTML = "Deliver as many packages as you can before time runs out!";
    // Sets the background image to one of Cincinnati
    switch (this.scene.get(`startScreen`).keyPressed) {
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
          document.getElementById("weatherImage").setAttribute('src', '/assets/images/cloudy.png');
          document.getElementById("weatherText").innerHTML = "It is currently cloudy"
        } else if (weather == 'Thunderstorm') {
          document.getElementById("weatherImage").setAttribute('src', '/assets/images/thunder.png');
          document.getElementById("weatherText").innerHTML = "It is currently thundering"
        } else if (weather == 'Drizzle') {
          document.getElementById("weatherImage").setAttribute('src', '/assets/images/rain.png');
          document.getElementById("weatherText").innerHTML = "It is currently raining"
        } else if (weather == 'Rain') {
          document.getElementById("weatherImage").setAttribute('src', '/assets/images/rain.png');
          document.getElementById("weatherText").innerHTML = "It is currently raining"
        } else if (weather == 'Snow') {
          document.getElementById("weatherImage").setAttribute('src', '/assets/images/snow.png');
          document.getElementById("weatherText").innerHTML = "It is currently snowing"
        } else if (weather == 'Clear') {
          document.getElementById("weatherImage").setAttribute('src', '/assets/images/sunny.png');
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
    let style = {
      font: '30px Arial',
      fill: 'black'
    };

    // bird spawn timer
    setInterval(this.spawnBird, 500)

    // Display the score in the top left corner
    // Parameters: x position, y position, text, style
    this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

    this.anims.create({
      key: "drone_anim",
      frames: this.anims.generateFrameNumbers("drone"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "bird_anim",
      frames: this.anims.generateFrameNumbers("bird"),
      frameRate: 10,
      repeat: -1
    });

    this.player = this.physics.add.sprite(350, 100, "drone");
    this.player.play("drone_anim");
    this.player.setScale(this.scaleMult);
    this.player.setCollideWorldBounds(true);
    this.holding = false;
    this.setDown = false;
    this.holdInput = false;
    this.transitionTime = 200;

    // Bird logic
    this.bird = this.physics.add.sprite(0, Phaser.Math.Between(0, 600), 'bird');
    this.bird.setScale(3);
    this.bird.play("bird_anim");
    
  }
	
hurt(player) {
	this.score -= 5;
  this.scoreText.setText('score: ' + this.score);
}

  update() {
    this.moveBird(this.bird, 3)

    let speed = 3 * this.scaleMult;
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

    if (this.arrow.space.isDown && !this.holdInput) {
      this.holdInput = true;
      //console.log("space");
      this.descendAscend();
      if (this.physics.overlap(this.player, this.package) || this.holding) {
        // Call the new hit() method
        this.hit();
      }
    }



    if(this.physics.overlap(this.player, this.bird) && this.hurtTimer<=0){
      this.hurt();
      this.hurtTimer = 1000;
    }

    if (this.holdInput) {
      // console.log("running");
      this.inputHoldTimer();
    }
    if (this.setDown) {
      // console.log("running");
      this.setDownTimer();
    }

    if (this.holding) {
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
    //this.timer();
    let elapsedTimer = this.showDelta();
    this.deltaTimer += elapsedTimer;
    if (this.deltaTimer > 1000) {
      this.timer();
      this.deltaTimer = 0;
    }

    if(this.hurtTimer>0){
      this.hurtTimer-=elapsedTimer;
    }

    if(this.hurtTimer>750){
      if(this.shovex==0 && this.shovey==0){
        let posNegShovex = Phaser.Math.Between(-1, 1);
        let posNegShovey = Phaser.Math.Between(-1, 1);
        
        if(posNegShovex>0){
          posNegShovex = 1;
        }else{
          posNegShovex = -1;
        }
        
        if(posNegShovey>0){
          posNegShovey = 1;
        }else{
          posNegShovey = -1;
        }
      
        this.shovey = Phaser.Math.Between(6, 9)*posNegShovey;
        this.shovex = Phaser.Math.Between(6, 9);
      }else{
        this.player.x += this.shovex;
        this.player.y += this.shovey;
        if(this.holding){
        this.package.x += this.shovex;
        this.package.y += this.shovey;
        }
      }
    }else{
      this.shovex = 0;
      this.shovey = 0;
    }
    console.log(this.hurtTimer);


  } //End of update

  // Bird logic
  moveBird(bird, speed) {
    bird.x += speed;

    if (bird.x > 1100) {
      this.resetBirdPos(bird)
    }
  }

  resetBirdPos(bird) {
    bird.x = 0;
    var randomY = Phaser.Math.Between(0, 500);
    bird.y = randomY;
  }

  // Randomizes the location of the house and resets the package spawn point
  randomizeLocations() {
    this.time.addEvent({
      delay: 200,
      callback: () => {
        this.house.x = Phaser.Math.Between(100, 1000);
        this.house.y = Phaser.Math.Between(100, 500);
      },
      loop: false
    })
    this.package.x = 405;
    this.package.y = 500;
  }

  async hit() {

    if (this.holding) {
      this.holding = false;
      this.setDown = true;
      this.descendAscend();
      this.putDownPackage();
    } else if (!this.holding && !this.setDown) {
      this.descendAscend();
      await new Promise(r => setTimeout(r, this.transitionTime));
      this.pickUpPackage();
    }
  }
  async descendAscend() {
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


  movePackage(speed) {
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

  pickUpPackage() {
    this.holding = true;
    this.tweens.add({
      targets: this.package, // on the player 
      duration: this.transitionTime, // for 200ms 
      scaleX: 1.8, // Increase scale by 80% on the vertical axis
      scaleY: 1.8, // Increase scale by 80% on the horizontal axis
      yoyo: false, // at the end, do not go back to original scale 
    });
  }

  putDownPackage() {
    this.holding = false;
    this.tweens.add({
      targets: this.package, // on the player 
      duration: this.transitionTime, // for 200ms 
      scaleX: 1, // Return the vertical scale to default 
      scaleY: 1, // Return the horizontal scale to default 
      yoyo: false, // Unsure if I need to define this here or not. Too lazy to check. 
    });
  }

  async timer() {
    //await new Promise(r => setTimeout(r, 1000));
    //setInterval( function() {
    if (this.counter >= 0) {
      let countID = document.getElementById('count');
      //console.log(document.getElementById('count'));
      countID.innerHTML = "Delivery Timer: " + this.counter;
      this.gameOver = true;
    } else if (this.gameOver) {
      alert("Game Over! Final Score: " + this.score);
      this.gameOver = false;
      window.location.reload();
    }
    this.counter--;
    //}, 1000)
  }

  async setDownTimer() {
    await new Promise(r => setTimeout(r, 1000));
    this.setDown = false;
  }
  async inputHoldTimer() {
    //console.log(this.holdInput);
    await new Promise(r => setTimeout(r, 1000));
    this.holdInput = false;
    //console.log(this.holdInput);
  }


  getTime() {
    //make a new date object
    let d = new Date();

    //return the number of milliseconds since 1 January 1970 00:00:00.
    return d.getTime();
  }
  showDelta() {
    //subtract the start time from the time now
    // 
    let elapsed = this.getTime() - this.startTime;

    //log the result
    //console.log("start time=" + this.startTime);
    //console.log("delta time=" + elapsed);

    //reset the start time
    this.startTime = this.getTime();
    return elapsed;
  }
}
