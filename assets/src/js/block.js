import {player} from "./player.js";

export class piece extends Phaser.GameObjects.Container {
    constructor(scene, x, y, shapes, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        this.shapes = shapes;
        this.shape_id = 0;
        this.setSize(150, 150);
        this.setInteractive();
        this.on('wheel', (pointer, deltaX, deltaY, deltaZ) => {
            if (!player.cardsys.turn)
                return;
            if (deltaY > 0) {
                this.turnBlock(scene, 1);
            }
            else if (deltaY < 0) {
                this.turnBlock(scene, 0);
            }
        });
        
        this.on('pointerdown', (pointer) => {
            if (pointer.rightButtonDown()) {
                return;
            }
            else if (player.cardsys.draggable_block === null) {
                player.cardsys.draggable_block = this;
                this.setData('startX', this.x);
                this.setData('startY', this.y);
                this.setDepth(4);
                this.setPosition(pointer.x, pointer.y);
                console.log(player.cardsys.draggable_block === this);
            }
            else if (player.cardsys.draggable_block !== null) {
                this.setDepth(1);
                player.cardsys.draggable_block = null;
            }
        });

        this.on('pointermove', (pointer) => {
            if (player.cardsys.draggable_block === this) {
                this.x = pointer.x;
                this.y = pointer.y;
            }
        });

        this.on('pointerup', (pointer) => {
            if (pointer.rightButtonDown()) {
                return;
            }
            else if (this.placeBlock(scene, pointer) === false) {
                this.x = this.getData('startX'); // Reset to original position
                this.y = this.getData('startY');
		        return;
            }
            else {
                scene.HAND_AREA.position_init();
                scene.spawnCards();
                scene.Phase = 0;
                scene.ready_phase();
            }
        });
    }

    turnBlock(scene, direction) {
        let next_shape = 0;
        console.log('hierw', direction);
        if (direction === 1) {
            next_shape = (this.shape_id+1) % 4;
        }
        else if (direction === 0) {
            next_shape = (this.shape_id+3) % 4;
        }
        const shape = this.shapes[next_shape]; // get next shape
        console.log(this.list);
        let l = this.list.length;
        for (let i=0;i<l;i++) {
            this.list[l-i-1].destroy();
        }
        l = shape.length;
        for (let i=0;i<l;i++) {
            let p = shape[i];
            let block = scene.add.rectangle(
                (p[1]-1) * scene.TILE_SIZE, (p[0]-1) * scene.TILE_SIZE, scene.TILE_SIZE - 4, scene.TILE_SIZE - 4, 0x00aaff
            );
            this.add(block); // Add blocks to the piece
        };
        this.shape_id = next_shape;
    }

    placeBlock(scene, pointer) {
        let shape = this.shapes[this.shape_id];
        let offsetX = Math.floor((pointer.x - scene.BOARD_OFFSET_X) / (scene.TILE_SIZE+2));
        let offsetY = Math.floor((pointer.y - scene.BOARD_OFFSET_Y) / (scene.TILE_SIZE+2));
        if (this.canPlace(scene, shape, offsetX, offsetY)) { // Check if placement is valid
            shape.forEach((p) => {
                scene.Grid[offsetY + p[0]-1][offsetX + p[1]-1] = 1; // Mark grid as filled
                let block = scene.add.rectangle(
                    scene.BOARD_OFFSET_X+10 + 2.5 + (offsetX + p[1]-1) * scene.TILE_SIZE,
                    scene.BOARD_OFFSET_Y+10 + 2.5 + (offsetY + p[0]-1) * scene.TILE_SIZE,
                    scene.TILE_SIZE - 5, scene.TILE_SIZE - 5, 0xaaff00
                );
            block.setDepth(1);
                block.setOrigin(0, 0);
                scene.grid[offsetY+p[0]-1][offsetX+p[1]-1] = block;
            });
            // 배치한 블록의 정보를 서버로 보낸다.
            player.socket.emit('block place', {point: [offsetY, offsetX], block: this.shapes[this.shape_id]});
            return true;
        }
        return false; // Placement failed
    }

    canPlace(scene, shape, offsetX, offsetY) {
        return shape.every((p) =>
            (scene.Grid[offsetY + p[0]-1] && scene.Grid[offsetY + p[0]-1][offsetX + p[1]-1] === 0)
        );
    }
}