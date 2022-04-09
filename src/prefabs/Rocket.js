// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture,frame){
        super(scene,x,y,texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
    }
}