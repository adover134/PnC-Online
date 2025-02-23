import {player} from "./player.js";

export class Card extends Phaser.GameObjects.Container {
    constructor(scene, x, y, name, id, d_id, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        this.id = id;
        this.d_id = d_id;
        this.name = name;
        this.image = null;
        this.setDepth(2);
        this.setSize(78, 104);
        this.setInteractive();
        this.on('pointerdown', (pointer) => {
            // 우클릭 시 설명 처리하기 위한 부분 - 추후 수정 예정
            if (pointer.rightButtonDown()) {
                player.socket.emit('card info ask', this.id);
            }
            else if (!player.cardsys.turn)
                return;
            else if (player.cardsys.draggable_card === null) {
                player.cardsys.draggable_card = this;
                this.setData('startX', this.x);
                this.setData('startY', this.y);
                this.setDepth(3);
                this.setPosition(pointer.x, pointer.y);
            }
            else if (player.cardsys.draggable_card === this) {
                this.setDepth(1);
                player.cardsys.draggable_card = null;
            }
        });

        this.on('pointermove', (pointer) => {
            if (player.cardsys.draggable_card === this) {
                this.x = pointer.x;
                this.y = pointer.y;
            }
        });

        this.on('pointerup', (pointer) => {
            if (pointer.rightButtonDown()) {
                return;
            }
            let k = this.useCard(scene, pointer);
            if (k === false) {
                this.x = this.getData('startX'); // Reset to original position
                this.y = this.getData('startY');
            }
            else if (k === true) {
                this.setPosition(-1000, -1000);
                player.cardsys.using_card = this;
                player.socket.emit('use card', this.d_id);
            }
        });
    }

    set_image(scene) {
        this.image = this.add(scene.add.image(0, 0, 'cards', this.id).setDisplaySize(this.width, this.height));
        this.image.setDisplaySize(this.width, this.height);
    }

    useCard(scene, pointer) {
        const offsetX = Math.floor(pointer.x);
        const offsetY = Math.floor(pointer.y);
        if (offsetX >= scene.BOARD_OFFSET_X && offsetX <= scene.BOARD_OFFSET_X+400 && offsetY >= scene.BOARD_OFFSET_Y && offsetY <= scene.BOARD_OFFSET_Y+400)
            return true;
        else
            return false;
    }
}