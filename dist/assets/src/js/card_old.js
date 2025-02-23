export class card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, name, id, blocks, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        this.name = name;
        this.id = id;
        this.setDepth(3);
        this.setSize(90, 120);
        this.setInteractive({ draggable: true });
        this.blocks = blocks;
    }
    addImage(scene) {
        this.image = this.add(scene.add.image(0, 0, 'cards', this.id));
        this.image.setDepth(3);
        this.image.setScale(0.2, 0.2);
    }
}