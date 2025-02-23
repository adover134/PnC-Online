import {shuffle} from './shuffle.js';
export class main_deck_zone extends Phaser.GameObjects.Container {
    constructor(scene, x, y, MainDeck, children) {
        super(scene, x, y, children);
        this.setSize(150, 172);
        this.setDepth(1);
        this.setInteractive({ enabled: true });
        this.main_deck = MainDeck;
        scene.add.existing(this);
    }

    deck_shuffle () {
        shuffle(this.main_deck);
    }
    fill_main_deck (Card) {
        this.main_deck.append(Card);
    }
    draw_from_deck () {
        return this.main_deck.shift();
    }
}