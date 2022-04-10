class Rocket extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture,frame){
        super(scene,x,y,texture, frame);
        
        scene.add.existing(this); // add object to existing scene
        this.points = pointValue;
        this.moveSpeed = 3;
    }

    update(){
        // left/right movement
        this.x -= this.moveSpeed;
        // wrap around from left edge to right edge
        if(this.x <= 0 - this.width){
            this.x = game.config.width;
        }
    }
}