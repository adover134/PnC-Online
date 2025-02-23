export class grid_zone extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        this.setSize(400, 400);
        this.setDepth(1);
        this.setInteractive({ enabled: true });
        scene.add.existing(this);
    }
    
    drawGrid(scene) {
        scene.graphics.lineStyle(1, 0xffffff, 1); // Thin grid lines
        for (let i = 0; i <= scene.GRID_SIZE; i++) {
            // Draw horizontal lines
            let l = this.add(scene.graphics.strokeLineShape(new Phaser.Geom.Line(
                -190, i * scene.TILE_SIZE-190,
                scene.GRID_SIZE * scene.TILE_SIZE-190, i * scene.TILE_SIZE-190
            )));
            l.setDepth(0);
            // Draw vertical lines
            let m = this.add(scene.graphics.strokeLineShape(new Phaser.Geom.Line(
                i * scene.TILE_SIZE-190, -190,
                i * scene.TILE_SIZE-190, scene.GRID_SIZE * scene.TILE_SIZE-190
            )));
            m.setDepth(0);
        }
        scene.grid = new Array(10).fill();
        for (let i = 0; i < 10; i++) {
            scene.grid[i] = new Array(10).fill(null);
        }
    }
}