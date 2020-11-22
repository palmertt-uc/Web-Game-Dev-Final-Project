class startScreenScene extends Phaser.Scene {
  // The 3 methods
  constructor(){
    super("startScreen");
  }
  create(){
    
    this.add.text(20,20, "Select Level");
    this.add.text(20,40, "Press 1 for Cincinnati");
    this.add.text(20,60, "Press 2 for Chicago");
    this.add.text(20,80, "Press 3 for Houston");
    this.add.text(20,100, "Press 4 for Los Angeles");
    this.add.text(20,120, "Press 5 for Miami");
    this.add.text(20,140, "Press 6 for New York");
    this.input.keyboard.once('keydown_ONE',function(){
      console.log("Hello from the A key");
      this.keyPressed = 1;
      this.scene.start("runGame");
    },this)
    this.input.keyboard.once('keydown_TWO',function(){
      console.log("Hello from the A key");
      this.keyPressed = 2;
      this.scene.start("runGame");
    },this)
    this.input.keyboard.once('keydown_THREE',function(){
      console.log("Hello from the A key");
      this.keyPressed = 3;
      this.scene.start("runGame");
    },this)
    this.input.keyboard.once('keydown_FOUR',function(){
      console.log("Hello from the A key");
      this.keyPressed = 4;
      this.scene.start("runGame");
    },this)
    this.input.keyboard.once('keydown_FIVE',function(){
      console.log("Hello from the A key");
      this.keyPressed = 5;
      this.scene.start("runGame");
    },this)
    this.input.keyboard.once('keydown_SIX',function(){
      console.log("Hello from the A key");
      this.keyPressed = 6;
      this.scene.start("runGame");
    },this)
  }

  update(){

  }
}