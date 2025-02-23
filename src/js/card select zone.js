import { player } from "./player.js";
import { CardImage } from "./card image.js";
import { Button } from "./button.js";

export class CardSelectZone extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        this.setSize(980, 350);
    }
    init(scene, x, y, side, info, purpose, children) {
        this.setPosition(x, y);
        this.setInteractive();
        this.rectangle = this.add(scene.add.rectangle(0, 0, 980, 350, 0xaa00ff));
        this.rectangle.setDepth(4);
        this.side = side;
        this.cards = [];
        this.id = info.id;
        this.confirm = new Button(scene, 500, 455).setSize(200, 40);
        this.confirm.setInteractive();
        this.confirm.on('pointerdown', () => this.confirm_result(scene));
        this.confirm.setDepth(5);
        this.confirm.set_color(scene, 0x663399);
        this.confirm.set_text(scene, '결정');
        this.value = info.info.value;
        this.purpose = purpose;
        this.text1 = scene.add.text(0, -150, this.generate_text(), {
            fontSize: '32px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#ffffff'
        });        
        this.text1.setPosition(0-(this.text1.width)/2, -150-(this.text1.height)/2);
        this.text2 = scene.add.text(0, -100, `${this.cards.length}장 중 0장 선택됨`, {
            fontSize: '32px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#ffffff'
        });
        this.text2.setPosition(0-(this.text2.width)/2, -100-(this.text2.height)/2);
        this.add(this.text1);
        this.add(this.text2);
        this.left = 0;
        this.right = 4;
        this.left_button = new Button(scene, 205, 455);
        this.right_button = new Button(scene, 795, 455);
        this.left_button.setSize(100, 40);
        this.right_button.setSize(100, 40);
        this.left_button.setInteractive();
        this.right_button.setInteractive();
        this.left_button.set_color(scene, 0x4545cd, '12px');
        this.right_button.set_color(scene, 0x4545cd, '12px');
        this.left_button.set_text(scene, 'left');
        this.right_button.set_text(scene, 'right');
        this.left_button.setDepth(5);
        this.right_button.setDepth(5);
        this.left_button.on('pointerdown', () => this.print_left());
        this.right_button.on('pointerdown', () => this.print_right());
        if (side === 'p')
            this.set_cards(scene, this.id);
        else
            this.set_cards(scene, -1);
    }
    generate_text() {
        let t = '';
        if (this.purpose === 'ready') {
            t = '핸드 5장 초과! ';
        }
        if ((typeof this.value[0] === 'number') && (typeof this.value[1] === 'number')) {
            if (this.value[0] === this.value[1]){
                t = t+`${this.value[0].toString()}장 `;
            }
        }
        else{
            if (typeof this.value[0] === 'number') {
                if (this.value[0] !== 0)
                {
                    t = t+this.value[0].toString();
                    t = t+'장 이상 '
                }
            }
            if (typeof this.value[1] === 'number') {
                t = t+`${this.value[1].toString()}장 이하로 `
            }
            if ((typeof this.value[0] !== 'number') && (typeof this.value[1] !== 'number')) {
                t = t+'임의의 장 수만큼'
            }
        }        
        t = t+'선택'
        return t;
    }
    set_cards (scene, id) {
        let cards = player.cardsys.hand;
        let len = cards.length;
        let j = 0;
        for (let i=0;i<len;i++)
        {
            if (cards[i].d_id === id)
                cards[i].setPosition(-900, -900);
            else{
                let c = new CardImage(scene, -1000, -1000, cards[i].id);
                j = j+1;
                c.setData("id", cards[i].d_id);
                c.on('pointerdown', () => {
                    c.toggle();
                    this.text2.setText(`${this.cards.length}장 중 ${this.get_chosen_num()}장 선택됨`);
                });
                c.setDepth(5);
                this.cards.push(c);
            }
        }
        if (this.cards.length > 4)
            this.right = 4;
        else
            this.right = this.cards.length-1;
        this.print_cards();
    }
    print_cards() {
        this.text2.setText(`${this.cards.length}장 중 ${this.get_chosen_num()}장 선택됨`);
        for (let i=this.left; i<= this.right; i++) {
            let Card = this.cards[i];
            Card.setData("startX", 162*(i-this.left)+95);
            Card.setData("startY", 325);
            Card.setPosition(162*(i-this.left)+95, 325);
        };
    }
    print_left() {
        if (player.cardsys.draggable_card !== null)
            return;
        if (this.left > 0) {
            for (let i=0; i< player.cardsys.hand.length; i++) {
                let Card = player.cardsys.hand[i];
                Card.setPosition(-1000, -1000);
            }
            this.left = this.left - 1;
            this.right = this.right - 1;
            this.print_cards();
        }
    }
    print_right() {
        if (player.cardsys.draggable_card !== null)
            return;
        if (this.right < (player.cardsys.hand.length - 1)) {
            for (let i=0; i< player.cardsys.hand.length; i++) {
                let Card = player.cardsys.hand[i];
                Card.setPosition(-1000, -1000);
            }
            this.left = this.left + 1;
            this.right = this.right + 1;
            this.print_cards();
        }
    }
    get_chosen_num() {
        let n = 0;
        for (let card of this.cards) {
            if (card.chosen)
                n = n+1;
        }
        return n;
    }
    confirm_result(scene) {
        let n = this.get_chosen_num();
        this.confirm_cost(scene);
    }
    confirm_cost(scene) {
        let can_confirm = false;
        console.log(this.value);
        let n = this.get_chosen_num();
        if (this.value[0] === 'n') {
            can_confirm = true;
        }
        else if (this.value[1] === 'n') {
            if (this.value[0] <= n){
                can_confirm = true;
            }
        }
        else {
            if ((this.value[0] <= n) && (this.value[1] >= n)){
                can_confirm = true;
            }
        }
        // 코스트로 선택된 수가 범위에 맞다면
        if (can_confirm) {
            let chosen_cards = [];
            // 선택된 카드들의 d_id를 구한다.
            for (let card of this.cards) {
                if (card.chosen)
                    chosen_cards.push(card.getData("id"));
            }
            if (this.purpose === 'cost')
            {// 현재 카드의 d_id와 함께 코스트 처리 신호를 보낸다.
                player.socket.emit('cost submit', {d_id: this.id, info: chosen_cards});
                for (let card of this.cards) {
                    card.destroy();
                }
            }
            else if (this.purpose === 'effect')
            {// 현재 카드의 d_id와 함께 효과 처리 신호를 보낸다.
                player.socket.emit('effect submit', {d_id: this.id, info: chosen_cards});
                for (let card of this.cards) {
                    card.destroy();
                }
            }
            else if (this.purpose === 'ready')
            {
                player.socket.emit('Hand Ready Done', {info: chosen_cards});
                for (let card of this.cards) {
                    card.destroy();
                }
            }
            this.confirm.destroy();
            this.left_button.destroy();
            this.right_button.destroy();
            scene.HAND_AREA.enable_interactive();
            this.setPosition(-1500, -1000);
        }
    }
}