document.oncontextmenu = function (e) {
    return false;
}

import {piece} from "./block.js";

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
        this.HAND_OFFSET_X = 320;
        this.HAND_OFFSET_Y = 430;
        this.TRASH_ZONE_OFFSET_X = 800;
        this.TRASH_ZONE_OFFSET_Y = 30;
        this.MAIN_DECK_OFFSET_X = 800;
        this.MAIN_DECK_OFFSET_Y = 320;
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
        this.gameOver = false;
    }
    
    drawGrid(scene) {
        scene.graphics.lineStyle(1, 0xffffff, 1); // Thin grid lines
        for (let i = 0; i <= this.GRID_SIZE; i++) {
            // Draw horizontal lines
            scene.graphics.strokeLineShape(new Phaser.Geom.Line(
                this.BOARD_OFFSET_X, this.BOARD_OFFSET_Y + i * this.TILE_SIZE,
                this.BOARD_OFFSET_X + this.GRID_SIZE * this.TILE_SIZE, this.BOARD_OFFSET_Y + i * this.TILE_SIZE
            ));
            // Draw vertical lines
            scene.graphics.strokeLineShape(new Phaser.Geom.Line(
                this.BOARD_OFFSET_X + i * this.TILE_SIZE, this.BOARD_OFFSET_Y,
                this.BOARD_OFFSET_X + i * this.TILE_SIZE, this.BOARD_OFFSET_Y + this.GRID_SIZE * this.TILE_SIZE
            ));
        }
        scene.grid = new Array(10).fill();
        for (let i = 0; i < 10; i++) {
            scene.grid[i] = new Array(10).fill(null);
        }
    }

    spawnPieces(scene) {
        while (scene.pieces.length < 3) { // Ensure 3 pieces are always displayed
            const SHAPE = Math.ceil(Math.random() * 10); // Pick a random shape
            const shape = this.SHAPES[SHAPE];
            const Piece = new piece(this, this.HAND_OFFSET_X + scene.pieces.length * 126, this.HAND_OFFSET_Y);
    
            shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        const block = scene.add.rectangle(
                            x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE - 5, this.TILE_SIZE - 5, 0x00aaff
                        );
                        Piece.add(block); // Add blocks to the piece
                    }
                });
            });
            Piece.setDepth(1);
            Piece.setSize(this.TILE_SIZE * shape[0].length, this.TILE_SIZE * shape.length); // Set size for hit testing
            Piece.setInteractive({ draggable: true }); // Make the piece draggable
            Piece.setData('shape', SHAPE); // Store the shape data
            scene.pieces.push(Piece); // Keep track of the piece
        }
    }

    turnBlock(Piece, scene, SHAPE, gameObjects) {
        const shape = this.SHAPES[SHAPE]; // get next shape
        const piece_y = Piece.y; // get current y value
        const piece_x = Piece.x; // get current x value
        const piece_start_x = Piece.getData('startX');
        const piece_start_y = Piece.getData('startY');
        const draggable = Piece.getData('dragging');
        scene.pieces = scene.pieces.filter(piece => !gameObjects.includes(piece));
        Piece.destroy();
        const new_piece = new piece(this, piece_x, piece_y);
        shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const block = scene.add.rectangle(
                        x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE - 5, this.TILE_SIZE - 5, 0x00aaff
                    );
                    new_piece.add(block); // Add blocks to the piece
                }
            });
        });
        new_piece.setSize(this.TILE_SIZE * shape[0].length, this.TILE_SIZE * shape.length); // Set size for hit testing
        new_piece.setInteractive({ draggable: true }); // Make the piece draggable
        new_piece.setData('shape', SHAPE); // Store the shape data
        new_piece.setData('startX', piece_start_x); // Store the start point x data
        new_piece.setData('startY', piece_start_y); // Store the start point y data
        new_piece.setData('dragging', draggable); // Store the bool whether was dragging
        scene.pieces.push(new_piece); // Keep track of the piece
    }

    placePiece(scene, piece) {
        const shape = this.SHAPES[piece.getData('shape')];
        const offsetX = Math.floor((piece.x - this.BOARD_OFFSET_X) / this.TILE_SIZE);
        const offsetY = Math.floor((piece.y - this.BOARD_OFFSET_Y) / this.TILE_SIZE);
        if (this.canPlace(shape, offsetX, offsetY)) { // Check if placement is valid
            shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        this.Grid[offsetY + y][offsetX + x] = 1; // Mark grid as filled
                        const block = scene.add.rectangle(
                            this.BOARD_OFFSET_X + 2.5 + (offsetX + x) * this.TILE_SIZE,
                            this.BOARD_OFFSET_Y + 2.5 + (offsetY + y) * this.TILE_SIZE,
                            this.TILE_SIZE - 5, this.TILE_SIZE - 5, 0xaaff00
                        );
                        block.setOrigin(0, 0);
                        scene.grid[offsetY+y][offsetX+x] = block;
                    }
                });
            });
            return true;
        }
        return false; // Placement failed
    }

    canPlace(shape, offsetX, offsetY) {
        return shape.every((row, y) =>
            row.every((cell, x) =>
                !cell || (this.Grid[offsetY + y] && this.Grid[offsetY + y][offsetX + x] === 0)
            )
        );
    }

    checkLines(scene) {
        // Check for completed lines (assuming 10x10 grid)
        let fullLineX = [], fullLineY = [];
        for (let i = 0; i < 10; i++) {
            // Check if one of a line is full
            fullLineY.push(true);
            fullLineX.push(true);
            for (let x = 0; x < 10; x++) {
                if (!this.Grid[i][x]) {
                    fullLineY[i] = 0;
                    break;
                }
            }
            for (let x = 0; x < 10; x++) {
                if (!this.Grid[x][i]) {
                    fullLineX[i] = 0;
                    break;
                }
            }
        }
        let sum = fullLineX.reduce((a, b) => (a+b))+fullLineY.reduce((a, b) => (a+b));
        my_score = my_score + sum * 10;
        for (let i = 0; i < 10; i++){
            // Check if one of a line is full
            if (fullLineY[i]) {
                for (let x=0; x < 10; x++) {
                    if (scene.grid[i][x] != null) {
                        scene.grid[i][x].destroy(); // Destroy the block
                        scene.grid[i][x] = null; // Clear the grid reference
                        this.Grid[i][x] = 0; // Clear the grid reference
                    }
                }
            }
            if (fullLineX[i]) {
                for (let x=0; x < 10; x++) {
                    if (scene.grid[x][i] != null) {
                        scene.grid[x][i].destroy(); // Destroy the block
                        scene.grid[x][i] = null; // Clear the grid reference
                        this.Grid[x][i] = 0; // Clear the grid reference
                    }
                }
            }
        }
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
        if ([1].includes(piece.getData('shape'))) {
            for (let i=0; i<10; i++) {
                for (let j=0; j<10; j++) {
                    if (this.Grid[i][j] == 0)
                        availability = true;
                }
            }
        }
        else if ([2, 3].includes(piece.getData('shape'))) {
            for (let i=0; i<9; i++) {
                for (let j=0; j<10; j++) {
                    if (this.Grid[i][j] == 0 && this.Grid[i+1][j] == 0)
                        availability = true;
                }
            }
            for (let i=0; i<10; i++) {
                for (let j=0; j<9; j++) {
                    if (this.Grid[i][j] == 0 && this.Grid[i][j+1] == 0)
                        availability = true;
                }
            }
        }
        else if ([4, 5].includes(piece.getData('shape'))) {
            for (let i=0; i<9; i++) {
                for (let j=0; j<9; j++) {
                    if ((this.Grid[i][j] == 0 && this.Grid[i+1][j+1] == 0) || (this.Grid[i][j+1] == 0 && this.Grid[i+1][j] == 0))
                        availability = true;
                }
            }
        }
        else if ([6, 7, 8, 9].includes(piece.getData('shape'))) {
            for (let i=0; i<8; i++) {
                for (let j=0; j<9; j++) {
                    if ((this.Grid[i][j] == 0 && this.Grid[i+1][j+1] == 0 && this.Grid[i+2][j] == 0) || (this.Grid[i][j+1] == 0 && this.Grid[i+1][j] == 0 && this.Grid[i+2][j+1] == 0))
                        availability = true;
                }
            }
            for (let i=0; i<9; i++) {
                for (let j=0; j<8; j++) {
                    if ((this.Grid[i][j] == 0 && this.Grid[i+1][j+1] == 0 && this.Grid[i][j+2] == 0) || (this.Grid[i+1][j] == 0 && this.Grid[i][j+1] == 0 && this.Grid[i+1][j+2] == 0))
                        availability = true;
                }
            }
        }
        else if ([10].includes(piece.getData('shape'))) {
            for (let i=0; i<9; i++) {
                for (let j=0; j<9; j++) {
                    if ((this.Grid[i][j] == 0 && this.Grid[i+1][j] == 0 && this.Grid[i][j+1] == 0 && this.Grid[i+1][j+1] == 0))
                        availability = true;
                }
            }
        }
        return availability;
    }

    preload() {

    }

    create() {
        this.graphics = this.add.graphics();
        this.input.setTopOnly(true);
        this.MyscoreText = this.add.text(this.SCORE_ZONE_OFFSET_X, this.SCORE_ZONE_OFFSET_Y, `My Score:${my_score}`, {
            fontSize: '20px',
            color: '#ffffff'
        });
        this.OpponentscoreText = this.add.text(this.SCORE_ZONE_OFFSET_X, this.SCORE_ZONE_OFFSET_Y+30, `Opponent Score:${opponent_score}`, {
            fontSize: '20px',
            color: '#ffffff'
        });
    
        this.grid = [];
        this.drawGrid(this);
    
        this.pieces = [];
        this.spawnPieces(this);

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const Piece = gameObjects[0];
            // piece에 해당하는 것 위에서 휠을 움직였을 경우 회전 시 다음을 수행
            if (Piece instanceof piece) {
                let number = Piece.getData('shape');

                if (deltaY > 0) {
                    if (Piece.getData('shape') == 2) {
                        number = 3;
                    }
                    if (Piece.getData('shape') == 3) {
                        number = 2;
                    }
                    if (Piece.getData('shape') == 4) {
                        number = 5;
                    }
                    if (Piece.getData('shape') == 5) {
                        number = 4;
                    }
                    if (Piece.getData('shape') == 6) {
                        number = 7;
                    }
                    if (Piece.getData('shape') == 7) {
                        number = 8;
                    }
                    if (Piece.getData('shape') == 8) {
                        number = 9;
                    }
                    if (Piece.getData('shape') == 9) {
                        number = 6;
                    }
                    this.turnBlock(Piece, this, number, gameObjects);
                }
                else if (deltaY < 0) {
                    if (Piece.getData('shape') == 2) {
                        number = 3;
                    }
                    if (Piece.getData('shape') == 3) {
                        number = 2;
                    }
                    if (Piece.getData('shape') == 4) {
                        number = 5;
                    }
                    if (Piece.getData('shape') == 5) {
                        number = 4;
                    }
                    if (Piece.getData('shape') == 6) {
                        number = 9;
                    }
                    if (Piece.getData('shape') == 7) {
                        number = 6;
                    }
                    if (Piece.getData('shape') == 8) {
                        number = 7;
                    }
                    if (Piece.getData('shape') == 9) {
                        number = 8;
                    }
                    this.turnBlock(Piece, this, number, gameObjects);
                }
            }
        });
    
        this.input.on('pointerdown', (pointer, gameObjects) => {
            const Piece = gameObjects[0];
            if (Piece instanceof piece){
                if (!pointer.rightButtonDown() && !Piece.getData('dragging')) {
                    let piece_x = structuredClone(Piece.x);
                    let piece_y = structuredClone(Piece.y);
                    Piece.setData('dragging', true);
                    Piece.setData('startX', piece_x);
                    Piece.setData('startY', piece_y);
                }
                else if (!pointer.rightButtonDown() && Piece.getData('dragging')) {
                    Piece.setData('dragging', false);
                }
            }
        });
    
        this.input.on('pointermove', (pointer, gameObjects) => {
            const Piece = gameObjects[0];
            if (Piece && Piece.getData('dragging')) {
                Piece.x = pointer.x;
                Piece.y = pointer.y;
            }
        });
    
        this.input.on('pointerup', (pointer, gameObjects) => {
            const Piece = gameObjects[0];
            let allPlaced = true;

            gameObjects.forEach(gameObject => {
                if (this.placePiece(this, gameObject) === false) {
                    allPlaced = false;
                    gameObject.x = gameObject.getData('startX'); // Reset to original position
                    gameObject.y = gameObject.getData('startY');
                }
            });

            if (allPlaced) {
                gameObjects.forEach(gameObject => {
                    gameObject.destroy(true); // Destroy each gameObject and its children
                });
                // Remove the pieces from the `this.pieces` array
                this.pieces = this.pieces.filter(piece => !gameObjects.includes(piece));
        
                // If all pieces have been placed, spawn new ones
                if (this.pieces.length === 0) {
                    this.spawnPieces(this);
                }
        
                this.checkLines(this); // Check and clear lines if any
                let available = this.checkSpace(this); // Check and set game over if cannot place anymore
                if (!available) {
                    this.cameras.main.fadeOut();
                    this.cameras.main.once(
                        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                        (cam, effect) => {
                            this.time.delayedCall(1000, () => {
                                this.scene.start("GameOverScene", { fadeIn: true });
                            });
                        }
                    );
                }
            }
            this.MyscoreText.destroy();
            this.MyscoreText = this.add.text(this.SCORE_ZONE_OFFSET_X, this.SCORE_ZONE_OFFSET_Y, `My Score:${my_score}`, {
                fontSize: '20px',
                color: '#ffffff'
            });
        });
    }

    update() {
        
    }
}