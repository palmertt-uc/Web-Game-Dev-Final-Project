class mainScene {
    preload() {

    }

    create() {

        fetch('https://api.openweathermap.org/data/2.5/weather?q=Cincinnati&appid=86b3ece53e58debf043613f6fc7f7cca')
        .then(response => response.json())
        .then(data => {
            let weather = data['weather'][0]['main']

            if (weather == 'Clouds') {
                
            } else if (weather == 'Thunderstorm') {

            } else if (weather == 'Drizzle') {

            } else if (weather == 'Rain') {

            } else if (weather == 'Snow') {

            } else if (weather == 'Clear') {

            } else {
                
            }
        })

        .catch(err => alert("Open Weather API Not Working"))

        this.score = 0;
        let style = {
            font: '20px Arial',
            fill: '#fff',
        };
        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);

        this.arrow = this.input.keyboard.createCursorKeys();
    }

    update() {

        if (this.arrow.right.isDown) {
            this.player.x += 3;
        } else if (this.arrow.left.isDown) {
            this.player.x -= 3;
        }
        
        if (this.arrow.down.isDown) {
            this.player.y += 3;
        } else if (this.arrow.up.isDown) {
            this.player.y -= 3;
        }
    }

    hit() {

        this.score += 10;

        this.scoreText.setText('score: ' + this.score);

        this.tweens.add({
            targets: this.player,
            duration: 200,
            scaleX: 2,
            scaleY: 2,
            yoyo: true,
        });
    }
}

new Phaser.Game({
    width: 700,
    height: 400,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
});