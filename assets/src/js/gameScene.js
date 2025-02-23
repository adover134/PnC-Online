document.oncontextmenu = function (e) {
    return false;
}

import {player} from "./player.js";
import {piece} from "./block.js";
import { GameOverBox } from "./gameOverBox.js";
import {grid_zone} from "./grid_zone.js";
import {HandZone} from "./hand_zone.js";
import {main_deck_zone} from "./main_deck_zone.js";
import {trash_zone} from "./trash_zone.js";
import { Button } from "./button.js";
import { CardSelectZone } from "./card select zone.js";
import { InfoZone } from "./info_zone.js";

export let my_score = 0;
export let opponent_score = 0;

export class GameScene extends Phaser.Scene {
    
    constructor() {
        super({ key: "GameScene" });
        this.GRID_SIZE = 10;
        this.TILE_SIZE = 38;
        this.SCORE_ZONE_OFFSET_X = 50;
        this.SCORE_ZONE_OFFSET_Y = 50;
        this.BOARD_OFFSET_X = 300;
        this.BOARD_OFFSET_Y = 20;
        this.HAND_OFFSET_X = 300;
        this.HAND_OFFSET_Y = 430;
        this.HAND_WIDTH = 400;
        this.HAND_HEIGHT = 160;
        this.TRASH_ZONE_OFFSET_X = 750;
        this.TRASH_ZONE_OFFSET_Y = 20;
        this.INFO_ZONE_OFFSET_X = 745;
        this.INFO_ZONE_OFFSET_Y = 90;
        this.INFO_WIDTH = 210;
        this.INFO_HEIGHT = 420;
        this.MAIN_DECK_OFFSET_X = 750;
        this.MAIN_DECK_OFFSET_Y = 530;
        this.Phase = 0;
        this.SHAPES = {
            1: [[1, 0, 0], [0, 0, 0], [0, 0, 0]], // Single block
            2: [[1, 1, 0], [0, 0, 0], [0, 0, 0]], // Horizontal line (2 blocks)
            3: [[1, 0, 0], [1, 0, 0], [0, 0, 0]], // Vertical line (2 blocks)
            4: [[1, 0, 0], [0, 1, 0], [0, 0, 0]],
            5: [[0, 1, 0], [1, 0, 0], [0, 0, 0]],
            6: [[1, 0, 1], [0, 1, 0], [0, 0, 0]],
            7: [[0, 1, 0], [1, 0, 0], [0, 1, 0]],
            8: [[0, 1, 0], [1, 0, 1], [0, 0, 0]],
            9: [[1, 0, 0], [0, 1, 0], [1, 0, 0]],
            10: [[1, 1, 0], [1, 1, 0], [0, 0, 0]], // 2x2 square
        };
        this.Grid = Array.from({ length: this.GRID_SIZE }, () => Array(this.GRID_SIZE).fill(0));
        this.Hand = new Array();
    }

    ready_phase() {
        this.destroy_pieces();
        this.pieces = [];
        this.reset_hand_cards();
    }

    reset_hand_cards() {
        let hand_cards = player.cardsys.hand;
        if (hand_cards.length < 5) {
            console.log('hi');
        }
        if (hand_cards.length > 5) {
            console.log('too much!');
        }
    }

    spawnPieces(blocks) {
        blocks.forEach((block) => {
            const shape = block[0];
            const Piece = new piece(this, this.pieces.length * 132+this.HAND_OFFSET_X+57, 0+this.HAND_OFFSET_Y+57, block);
            shape.forEach((p) => {
                const block = this.add.rectangle(
                    (p[1]-1) * this.TILE_SIZE, (p[0]-1) * this.TILE_SIZE, this.TILE_SIZE-4, this.TILE_SIZE-4, 0x00aaff
                );
                block.setDepth(1);
                block.setOrigin(0.5, 0.5);
                Piece.add(block); // Add blocks to the piece
            });
            Piece.setDepth(3);
            Piece.setSize((this.TILE_SIZE+1) * 3, (this.TILE_SIZE+1) * 3); // Set size for hit testing
            this.pieces.push(Piece); // Keep track of the piece
            player.cardsys.blocks.push(Piece);
        });
    }

    spawnCards() {
        this.HAND_AREA.position_init();
        this.HAND_AREA.print_cards(this);
    }

    placeBlock(pointer, Piece) {
        const shape = Piece.shapes[Piece.shape_id];
        console.log(pointer.x - this.BOARD_OFFSET_X, pointer.y - this.BOARD_OFFSET_Y);
        const offsetX = Math.floor((pointer.x - this.BOARD_OFFSET_X) / (this.TILE_SIZE+2));
        const offsetY = Math.floor((pointer.y - this.BOARD_OFFSET_Y) / (this.TILE_SIZE+2));
        if (this.canPlace(shape, offsetX, offsetY)) { // Check if placement is valid
            shape.forEach((p) => {
                this.Grid[offsetY + p[0]-1][offsetX + p[1]-1] = 1; // Mark grid as filled
                const block = this.add.rectangle(
                    this.BOARD_OFFSET_X+10 + 2.5 + (offsetX + p[1]-1) * this.TILE_SIZE,
                    this.BOARD_OFFSET_Y+10 + 2.5 + (offsetY + p[0]-1) * this.TILE_SIZE,
                    this.TILE_SIZE - 5, this.TILE_SIZE - 5, 0xaaff00
                );
            block.setDepth(1);
                block.setOrigin(0, 0);
                this.grid[offsetY+p[0]-1][offsetX+p[1]-1] = block;
            });
            // 배치한 블록의 정보를 서버로 보낸다.
            player.socket.emit('block place', {point: [offsetY, offsetX], block: Piece.shapes[Piece.shape_id]});
            return true;
        }
        return false; // Placement failed
    }

    destroy_pieces() {
        let l = this.pieces.length;
        for (let i=0;i<l;i++)
            this.pieces[l-i-1].destroy();
    }

    canPlace(shape, offsetX, offsetY) {
        return shape.every((p) =>
            (this.Grid[offsetY + p[0]-1] && this.Grid[offsetY + p[0]-1][offsetX + p[1]-1] === 0)
        );
    }

    checkSpace(scene) {
        const pieces = scene.pieces;
        let available = false;
        pieces.forEach(piece => {
            if (this.checkSpaces(scene, piece) === true) {
                available = true;
            }
        });
        return available;
    }

    checkSpaces(scene, piece) {
        let checks = [];
        let availability = false;
        let shape = piece.shapes[piece.shape_id];
        let size = shape.length;
        for (let i=0; i<10; i++) {
            for (let j=0; j<10; j++) {
                for (let k=0; k<size; k++) {
                    if ((i+shape[k][0] >= 10) || (j+shape[k][1] >= 10))
                        break;
                    else if ((this.Grid[i+shape[k][0]][j+shape[k][1]] == 0))
                        checks.push(true);
                }
                if (checks.length === size) {
                    availability = true;
                }
                checks = [];
            }
        }
        return availability;
    }

    turnChange(turn) {
        var k = null;
        if (turn === true) {
            k = 'Your';
        }
        else if (turn === false) {
            k = 'Opponent\'s';
        }
        var messagebox = new Button(this, 500, 300);
        messagebox.setSize(980, 100);
        messagebox.set_color(this, 0xaa00ff);
        messagebox.set_text(this, k+' Turn!', '96px', '#0f0');
        messagebox.setDepth(10);
        this.input.enabled = false;
        this.time.delayedCall(1000, () => {
            messagebox.destroy();
            this.input.enabled = true;
        });
    }

    gameOver(data) {
        this.gameover.showBox(data);
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.bitmapFont('gothic', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.png', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.xml');
    }

    create() {
        this.graphics = this.add.graphics();
        this.GRID_AREA = new grid_zone(this, this.BOARD_OFFSET_X+200, this.BOARD_OFFSET_Y+200);
        this.HAND_AREA = new HandZone(this, this.HAND_OFFSET_X+this.HAND_WIDTH/2, this.HAND_OFFSET_Y+this.HAND_HEIGHT/2);
        this.TRASH_AREA = new trash_zone(this, -200, -200);
        this.MAIN_DECK_AREA = new main_deck_zone(this, -200, -200);
        this.INFO_AREA = new InfoZone(this, this.INFO_ZONE_OFFSET_X+this.INFO_WIDTH/2, this.INFO_ZONE_OFFSET_Y+this.INFO_HEIGHT/2, 210, 420).layout()
        
        this.gameover = new GameOverBox(this);
        this.input.topOnly = false;

        this.MyscoreText = this.add.text(this.SCORE_ZONE_OFFSET_X, this.SCORE_ZONE_OFFSET_Y, `My Score : ${my_score}`, {
            fontSize: '20px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#ffffff'
        });
        this.OpponentscoreText = this.add.text(this.SCORE_ZONE_OFFSET_X, this.SCORE_ZONE_OFFSET_Y+30, `Op Score : ${opponent_score}`, {
            fontSize: '20px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#ffffff'
        });
        
        this.GRID_AREA.drawGrid(this);
    
        this.pieces = [];

        var message = null;        
        if (player.cardsys.turn === true) {
            message = new Button(this, 500, 300);
            message.setSize(980, 100);
            message.set_color(this, 0xaa00ff);
            message.set_text(this, 'You go first!', '96px', '#0f0');
        }
        else if (player.cardsys.turn === false) {
            message = new Button(this, 500, 300);
            message.setSize(980, 100);
            message.set_color(this, 0xaa00ff);
            message.set_text(this, 'You go second!', '96px', '#0f0');
        }
        message.setDepth(10);
        this.time.delayedCall(1000, () => {
            message.destroy();

            this.ready_phase();
            this.Phase = 1;
        });
        
        this.cardSelects = new CardSelectZone(this, -1500, -1000);
        this.cardSelects.setDepth(5);

        // 상대 블록 배치 정보가 들어왔을 때
        player.socket.on('opponent block', function(data) {
            player.socket.off('opponent block')
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (!player.cardsys.turn)
                return;
        });
    
        this.input.on('pointerdown', (pointer, gameObjects) => {
        });
    
        this.input.on('pointerup', (pointer, gameObjects) => {
            if (pointer.rightButtonDown()) {
                
            }
        });
    }

    update() {
        
    }
}