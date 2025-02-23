import {player} from "./player.js";
import { CardSystem } from "./card_system.js";
import * as cookie from "./cookie.js";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoadScene" });
        // 새 클라이언트 선언
        var username = cookie.getCookie("username");

        if (username != "" && username != "null") {
            player.askReturnPlayer(username);
        } else {
            player.askNewPlayer();
        }
    }

    // 실제 게임에서 사용할 데이터들을 로드하는 곳!
    preload () {
        this.load.image('title', '/src/assets/img/title.png');
        this.load.image('background', '/src/assets/img/menu_background.png');
        this.load.image('waitPage', '/src/assets/img/wait.png');
        this.load.image('menu', '/src/assets/img/menu.png');
        this.load.image('player', '/src/assets/img/player.png');
        this.load.image('counter', '/src/assets/img/counter.png');
        //game.load.json('dummy_deck','assets/dummy_deck.json');
        this.load.spritesheet('cards', '/src/assets/cards/cards.png', {frameWidth: 308, frameHeight: 408});
        this.load.spritesheet('chosen_cards', '/src/assets/cards/chosen_cards.png', {frameWidth: 308, frameHeight: 408});
		//game.load.audio('se_card0', 'assets/flip.wav');
		//game.load.audio('se_card1', 'assets/card1.wav');
		//game.load.audio('se_card2', 'assets/card2.wav');
		//game.load.audio('se_card3', 'assets/card3.wav');
		//game.load.audio('se_target', 'assets/target.wav');
		//game.load.audio('se_tograve', 'assets/tograve.wav');
        //game.load.audio('se_effect', 'assets/effect.wav');
        //game.load.audio('se_hit2', 'assets/hit2.wav');
    }

    // 게임에서 사용할 데이터가 적용되는 곳!
    create () {
		//ls.sounds['card0'] = new Phaser.Sound(game, 'se_card0', 0.7);
		//ls.sounds['card1'] = new Phaser.Sound(game, 'se_card1', 0.7);
		//ls.sounds['card2'] = new Phaser.Sound(game, 'se_card2', 0.7);
		//ls.sounds['card3'] = new Phaser.Sound(game, 'se_card3', 0.7);
        //ls.sounds['effect'] = new Phaser.Sound(game, 'se_effect', 0.4);
		//ls.sounds['tograve'] = new Phaser.Sound(game, 'se_tograve', 0.7);
        //ls.sounds['target'] = new Phaser.Sound(game, 'se_target', 0.7);
        //ls.sounds['hit2'] = new Phaser.Sound(game, 'se_hit2', 0.4);
        //console.log(cards);
        player.game = this.game;
        player.sounds = {};
        player.obj = {};

        this.game.events.on('visible',function(){
            console.log('visible');
        });
        this.game.scene.start('TitleScene');
    }

    update() {}
};