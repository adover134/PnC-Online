export class CardImage extends Phaser.GameObjects.Image {
    constructor(scene, x, y, id, width=150, height=200, children) {
        console.log(width, height);
        super(scene, x+width/2, y+height/2, 'cards', id, children);
        scene.add.existing(this);
        this.setDisplaySize(width, height);
        this.setInteractive();
        this.id = id;
        this.chosen = false;
        this.setDepth(5);
    }
    toggle() {
        if (this.chosen) {
            this.setTexture('cards', this.id);
            this.chosen = false;
        }
        else {
            this.setTexture('chosen_cards', this.id);
            this.chosen = true;
        }
    }
}