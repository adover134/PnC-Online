export class Text extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
        scene.add.existing(this);
        this.text = scene.add.text(0, 0, '0', {
            fontSize: '20px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#43ab32',
            verticalAlign: 'middle'
        });
        this.text.setAlign('center');
        this.text.setOrigin(0.5, 0.5);
        this.add(this.text);
    }
    setText (text) {
        this.text.setText(text);
    }
}