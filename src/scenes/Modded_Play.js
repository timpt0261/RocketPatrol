
class Modded_Play extends Phaser.Scene {
    constructor() {
        super("mod_playScene");
    }
    
    preload()
    {
        // load images/tile sprites
        this.load.image('dart','./assets/mod_assets/dart.png');
        
        this.load.image('blue_balloon', './assets/mod_assets/blue_balloon.png');
        this.load.image('red_balloon', './assets/mod_assets/red_balloon.png');
        this.load.image('green_balloon', './assets/mod_assets/green_balloon.png');

        this.load.image('ufo','./assets/mod_assets/ufo.png');

        this.load.image('confetti', './assets/mod_assets/confetti.png');

        this.load.image('audience', './assets/mod_assets/audience.png');
        this.load.image('children', './assets/mod_assets/children.png');

        this.load.image('booth', './assets/mod_assets/booth.png');
        this.load.image('clouds', './assets/mod_assets/clouds.png');
        this.load.image('paper','./assets/mod_assets/paper.png')

    }

    create(){
        
        // place tile sprite
        this.paper = this.add.tileSprite(0,0,640,480,'paper').setOrigin(0,0)
        this.clouds = this.add.tileSprite(0, 150, 640, 480/4, 'clouds').setOrigin(0, 0);

        this.audience_1 = this.add.tileSprite(100,310,120,60,'audience').setOrigin(0.5,0.5);
        this.audience_2 = this.add.tileSprite(200,310,120,60,'audience').setOrigin(0.5,0.5);
        this.audience_3 = this.add.tileSprite(300,310,120,60,'audience').setOrigin(0.5,0.5);
        this.audience_4 = this.add.tileSprite(400,310,120,60,'audience').setOrigin(0.5,0.5);
        this.audience_5 = this.add.tileSprite(500,310,120,60,'audience').setOrigin(0.5,0.5);
        
        this.children = this.add.tileSprite(220,340,95,35,'children').setOrigin(0.5,0.5);

        this.booth = this.add.image(0,15,'booth').setOrigin(0, 0);
        this.paper.displayWidth = this.sys.canvas.width;
        this.paper.displayHeight = this.sys.canvas.height;

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Dart (p1)
        this.p1Dart = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'dart').setOrigin(0.5, 0);

        // add Balloons (x3)
        this.ufo = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'ufo', 0, 60).setOrigin(0,0);

        this.red_balloon = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'red_balloon', 0, 30).setOrigin(0, 0);
        this.blue_balloon = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'blue_balloon', 0, 20).setOrigin(0,0);
        this.green_balloon = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'green_balloon', 0, 10).setOrigin(0,0);
        
        // initialize speed for ufo to be twice as fast
        this.ufo.moveSpeed *= 2;
        
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // creating emitter for particle system
        this.confetti = this.add.particles('confetti');
        this.emitter = this.confetti.createEmitter();
        
        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#FBEFD8',
            color: '#90CAF9',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        //add background
        this.clouds.tilePositionX -= .5;

        this.audience_1.tilePositionX -= .3;
        this.audience_2.tilePositionX += .3;
        this.audience_3.tilePositionX -= .3;
        this.audience_4.tilePositionX += .3;
        this.audience_5.tilePositionX -= .3;
        
        this.children.x = (this.children.x - 0.5) % 640;

        if (!this.gameOver) {               
            this.p1Dart.update();         // update dart sprite
            this.red_balloon.update();           // update balloons (x3)
            this.blue_balloon.update();
            this.green_balloon.update();
            this.ufo.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Dart, this.green_balloon)) {
            this.p1Dart.reset();
            this.balloonPop(this.green_balloon);   
        }
        if (this.checkCollision(this.p1Dart, this.blue_balloon)) {
            this.p1Dart.reset();
            this.balloonPop(this.blue_balloon);
        }
        if (this.checkCollision(this.p1Dart, this.red_balloon)) {
            this.p1Dart.reset();
            this.balloonPop(this.red_balloon);
        }
        if (this.checkCollision(this.p1Dart, this.ufo)) {
            this.p1Dart.reset();
            this.balloonPop(this.ufo);
        }


        
    }

    checkCollision(dart, balloon) {
        // simple AABB checking
        if (dart.x < balloon.x + balloon.width && 
            dart.x + dart.width > balloon.x && 
            dart.y < balloon.y + balloon.height && 
            dart.height + dart.y > balloon. y) {
                return true;
        } else {
            return false;
        }
    }

    balloonPop(balloon) {
        // temporarily hide balloon
        balloon.alpha = 0;
        // Modification for particle effect
        this.emitter.setPosition(balloon.x, balloon.y);
        this.emitter.setFrequency(4000,5);
        this.emitter.setSpeed(100);
        this.emitter.gravity = 200;
        this.emitter.setLifespan(60000);
        
        
        balloon.reset();
        balloon.alpha = 1;
        
        // score add and repaint
        this.p1Score += balloon.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_ballon_pop');
        this.emitter      
        }
    
}