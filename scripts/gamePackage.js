
  const startGameButton = document.getElementById(`startGameButton`);
  console.log(startGameButton);

new Phaser.Game({
  width: 1100, // Width of the game in pixels
  height: 600, // Height of the game in pixels
  backgroundColor: '#006400', // The background color (blue)
  scene: [startScreenScene, mainScene], // The name of the scene we created
  physics: { default: 'arcade' }, // The physics engine to use
  parent: 'game', // Create the game inside the <div id="game"> 
});

function create(){
  this.input.keyboard.on('keydown_A',function(event){
    console.log("Hello from the A key");
  })
}