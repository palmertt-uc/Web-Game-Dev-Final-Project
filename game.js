class mainScene {
    preload() {

    }

    create() {

        fetch('https://api.openweathermap.org/data/2.5/weather?q=Cincinnati&appid=86b3ece53e58debf043613f6fc7f7cca')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let weather = data['weather'][0]['main']

            if (weather == 'Clouds') {
                alert("According to Open Weather API, it is cloudy outside")
            } else if (weather == 'Thunderstorm') {
                alert("According to Open Weather API, there is a thunderstorm outside")
            } else if (weather == 'Drizzle') {
                alert("According to Open Weather API, there is a drizzle outside")
            } else if (weather == 'Rain') {
                alert("According to Open Weather API, it is raining outside")
            } else if (weather == 'Snow') {
                alert("According to Open Weather API, it is snowing outside")
            } else if (weather == 'Clear') {
                alert("According to Open Weather API, it is a clear sky")
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