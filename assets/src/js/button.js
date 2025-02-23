export class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        this.text = null;
        this.color = null;
        this.image = null;
    }
    set_text (scene, text, size='32px', color='#9f7') {
        this.text = scene.add.text(0, 0, text, {fontSize: size, color: color, fontFamily: "'Noto Sans KR', sans, serif", verticalAlign: 'middle'});
        this.text.setDepth(6);
        this.add(this.text);
        this.text.setAlign('center');
        this.text.setOrigin(0.5, 0.5);
        this.text.setVisible(true);
    }
    set_image (scene, img) {
        this.image = scene.add.image(0, 0, img);
        this.add(this.image);
        this.image.setDisplaySize(this.width, this.height);
    }
    set_color (scene, color) {
        this.color = scene.add.rectangle(0, 0, this.width, this.height, color);
        this.color.setDepth(5);
        this.add(this.color);
    }
}