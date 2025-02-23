import {player} from "./player.js";
import { Button } from "./button.js";
import { Text } from "./text.js";

export class HandZone extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        this.setSize(400, 160);
        this.setDepth(1);
        this.setInteractive();
        this.left = 0;
        this.right = 4;
        this.left_button = new Button(scene, scene.HAND_OFFSET_X+95, scene.HAND_OFFSET_Y+155);
        this.right_button = new Button(scene, scene.HAND_OFFSET_X+305, scene.HAND_OFFSET_Y+155);
        this.left_button.setSize(100, 50);
        this.right_button.setSize(100, 50);
        this.left_button.setInteractive();
        this.right_button.setInteractive();
        this.left_button.set_color(scene, 0xab45cd, '12px');
        this.right_button.set_color(scene, 0xab45cd, '12px');
        this.left_button.set_text(scene, 'left');
        this.right_button.set_text(scene, 'right');
        this.left_button.setDepth(1);
        this.right_button.setDepth(1);
        this.left_button.on('pointerdown', () => this.print_left());
        this.right_button.on('pointerdown', () => this.print_right());
        this.cards_num = new Text(scene, scene.HAND_OFFSET_X+200, scene.HAND_OFFSET_Y+155);
        this.cards_num.setSize(50, 50);
        this.cards_num.setText(scene, player.cardsys.hand.length.toString()+' / '+(this.left+1).toString()+'~'+(this.right+1).toString());
    }

    print_cards(scene) {
        this.cards_num.setText(player.cardsys.hand.length.toString()+' / '+(this.left+1).toString()+'~'+(this.right+1).toString());
        for (let i=this.left; i<= this.right; i++) {
            let Card = player.cardsys.hand[i];
            Card.setData("startX", (i-this.left)*80+1+scene.HAND_OFFSET_X+Card.width/2);
            Card.setData("startY", scene.HAND_OFFSET_Y+Card.height/2);
            Card.setX((i-this.left)*80+1+scene.HAND_OFFSET_X+Card.width/2);
            Card.setY(scene.HAND_OFFSET_Y+Card.height/2);
            Card.setDepth(1);
        };
    }

    disable_interactive() {
        player.cardsys.hand.forEach((Card, index) => {
            Card.disableInteractive();
        });
    }

    enable_interactive() {
        player.cardsys.hand.forEach((Card, index) => {
            Card.setInteractive();
        });
    }

    print_left() {
        let g = player.game.scene.getScene('GameScene');
        if (player.cardsys.draggable_card !== null)
            return;
        if (this.left > 0) {
            for (let i=0; i< player.cardsys.hand.length; i++) {
                let Card = player.cardsys.hand[i];
                Card.setPosition(-1000, -1000);
            }
            this.left = this.left - 1;
            this.right = this.right - 1;
            this.print_cards(g);
        }
    }

    print_right() {
        let g = player.game.scene.getScene('GameScene');
        if (player.cardsys.draggable_card !== null)
            return;
        if (this.right < (player.cardsys.hand.length - 1)) {
            for (let i=0; i< player.cardsys.hand.length; i++) {
                let Card = player.cardsys.hand[i];
                Card.setPosition(-1000, -1000);
            }
            this.left = this.left + 1;
            this.right = this.right + 1;
            this.print_cards(g);
        }
    }

    position_init() {
        this.left = 0;
        console.log(player.cardsys.hand);
        if (player.cardsys.hand.length < 5)
            this.right = player.cardsys.hand.length-1;
        else this.right = 4;
    }
}