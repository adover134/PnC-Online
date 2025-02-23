export class TestImage extends Phaser.GameObjects.Image {
    constructor(scene, x, y, id, children) {
        super(scene, x, y, 'cards', id, children);
        scene.add.existing(this);
        this.setSize(150, 200);
        this.setDisplaySize(150, 200);
        this.setInteractive();
        this.on('pointerdown', () => console.log(this));
        this.setDepth(25);
    }
}