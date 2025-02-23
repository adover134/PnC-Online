import { Card } from "./card.js";
import {player} from "./player.js";

export class CardSystem {
    constructor() {
        this.turn = false;
        this.turn_num = 1;
        this.cards = [];
        this.opponent_cards = [];
        this.hand = [];
        this.trash = [];
        this.draggable_card = null;
        this.using_card = null;
        this.draggable_block = null;
        this.blocks = [];
    }

    reset() {
        for (var card of this.cards) {
            card.destroy();
        }
        for (var card of this.opponent_cards) {
            card.destroy();
        }
        for (var block of this.blocks) {
            block.destroy();
        }
        this.turn = false;
        this.turn_num = 1;
        this.hand = [];
        this.trash = [];
        this.cards = [];
        this.opponent_cards = [];
        
        this.draggable_card = null;
        this.draggable_block = null;
    }
    
    match_init(scene, Cards, OpponentCards) {
        for (let i=0; i < 10; i++) {
            this.cards.push(new Card(scene, -1000, -1000, `player card ${i}`, Cards[i], i));
            this.cards[i].set_image(scene);
        }
        for (let i = 0; i < 10; i++) {
            this.opponent_cards.push(new Card(scene, -1000, -1000, `opponent player card ${i}`, OpponentCards[i], i));
            this.opponent_cards[i].set_image(scene);
        }
    }

    hand_add_cards (Cards) {
        for (let i = 0; i < Cards.length; i++) {
            this.hand.push(this.cards[Cards[i]]);
        }
    }

    trash_from_hand (Cards) {
        this.hand = this.hand.filter(e => !Cards.includes(e.d_id));
        for (let i = 0; i < Cards.length; i++) {
            this.trash.push(this.cards[Cards[i]]);
        }
    }
}