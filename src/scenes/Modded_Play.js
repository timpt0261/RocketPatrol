
class Modded_Play extends Phaser.Scene {
    constructor() {
        super("mod_playScene");
    }
    
    preload()
    {
        // load images/tile sprites
        this.load.image('dart','./assets/mod_assets/dart.png');
        
        this.load.image('blue_balloon', './assets/mod_assets/blue_ balloon.png');
        this.load.image('red_balloon', './assets/mod_assets/red_ balloon.png');
        this.load.image('green_balloon', './assets/mod_assets/green_ balloon.png');

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

        // // green UI background
        // this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Dart = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'dart').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.red_balloon = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'red_balloon', 0, 30).setOrigin(0, 0);
        this.blue_balloon = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'blue_balloon', 0, 20).setOrigin(0,0);
        this.green_balloon = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'green_balloon', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        })

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
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
        //add space background
        this.clouds.tilePositionX -= 4;

        if (!this.gameOver) {               
            this.p1Dart.update();         // update dart sprite
            this.red_balloon.update();           // update balloons (x3)
            this.blue_balloon.update();
            this.green_balloon.update();
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
        // create explosion sprite at balloon's position
        let boom = this.add.sprite(balloon.x, balloon.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
          balloon.reset();                       // reset balloon position
          balloon.alpha = 1;                     // make balloon visible again
          boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += balloon.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');       
        }

    
}