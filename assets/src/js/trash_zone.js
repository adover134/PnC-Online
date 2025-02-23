export class trash_zone extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        this.setSize(150, 172);
        this.setDepth(1);
        this.setInteractive({ enabled: true });
        scene.add.existing(this);
    }

    add_trash (card) {
        player.cardsys.trash.push(card);
    }
    get_all_trash () {
        return Object.assign([], player.cardsys.trash);
    }
}