import {Button} from "./button.js";
import {player as Player} from "./player.js";

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: "TitleScene" });
    }
    preload() {
    }
    create() {
        var player_info = this.add.image(125, 50, 'player');
        player_info.setDisplaySize(250, 100);
        var card_piece_counter = this.add.image(425, 50, 'counter');
        card_piece_counter.setDisplaySize(250, 100);
        var gem_counter = this.add.image(725, 50, 'counter');
        gem_counter.setDisplaySize(250, 100);
        var menu_background = this.add.image(this.game.config.width/2, 400, 'background');
        menu_background.setDisplaySize(this.game.config.width, 400);
        var b1 = new Button(this, 140, 400);
        var b2 = new Button(this, 380, 400);
        var b3 = new Button(this, 620, 400);
        var b4 = new Button(this, 860, 400);
        b1.setSize(200, 300);
        b2.setSize(200, 300);
        b3.setSize(200, 300);
        b4.setSize(200, 300);
        b1.set_image(this, 'menu');
        b2.set_image(this, 'menu');
        b3.set_image(this, 'menu');
        b4.set_image(this, 'menu');
        b1.set_text(this, 'Card\n\nManage');
        b2.set_text(this, 'Start\n\nMatch');
        b3.set_text(this, 'Card\n\nShop');
        b4.set_text(this, 'Cash\n\nShop');
        b1.setInteractive();
        b2.setInteractive();
        b3.setInteractive();
        b4.setInteractive();
        this.input.on('pointerdown', (pointer, gameObjects) => {
            if (gameObjects[0] === b2) {
                Player.findMatch();
            }
            else if(gameObjects[0] === b3){
                this.scene.stop();
                this.game.scene.start('TestScene');
            }
        });
    }
    update() {
        
    }
}