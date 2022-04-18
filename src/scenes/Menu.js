class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');

        // modded sound effects
        this.load.audio('sfx_swish', './assets/mod_assets/swish_sfx.wav');
        this.load.audio('sfx_ballon_pop', './assets/mod_assets/party_whistle.wav');
        this.load.audio('sfx_carnival_music', './assets/mod_assets/carnival_song.wav');

    }

    create(){
        // display score
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth:0
        }

        let modConfig = {
            fontFamily: 'Comic Sans',
            fontSize: '28px',
            backgroundColor: '#5500D4',
            color: '#FFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(game.config.width / 2, game.config.height / 2 + borderUISize + borderPadding, 'Press ← for Novice, → for Expert', menuConfig).setOrigin(0.5);
        this.add.text((game.config.width / 2) + 40, game.config.height / 2 + borderUISize + borderPadding + 53, '↑ for Modded', modConfig).setOrigin(0.75);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);


    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000,
                rocketSfx: 'sfx_rocket'    
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000,
                rocketSfx: 'sfx_rocket'

            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');    
        }

        if(Phaser.Input.Keyboard.JustDown(keyUP)){
            // modded mode
            game.settings = {
                spaceshipSpeed: 2,
                gameTimer: 60000,
                rocketSfx: 'sfx_swish',

            }
            this.scene.start('mod_playScene');
        }
    }

}

