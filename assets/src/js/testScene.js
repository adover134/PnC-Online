// import { TestImage } from "./test image.js";
// import { CardImage } from "./card image.js";
// import { TestScroll } from "./test scroll";
import { InfoZone } from "./info_zone.js";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: "TestScene" });
        // 새 클라이언트 선언
    }
    preload () {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.bitmapFont('gothic', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.png', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.xml');
    }
    create () {
        /*var testImage = this.add.image(200, 200, 'menu');
        this.scene.stop("GameOverScene");
        testImage.setDisplaySize(100, 100);
        testImage.setInteractive();
        testImage.on('pointerdown', ()=>console.log('huh', testImage));*/

        //var testRect = this.add.rectangle(200, 200, 100, 100, 0x33aa33);

        // var testImage2 = new TestImage(this, 600, 200, 15);

        var scene = this;
        var scrollablePanel = new InfoZone(scene, 740, 90, 210, 420).layout()
        scene.print = scene.add.text(0, 0, '');
        scene.input.topOnly = false;

        var labels = [];
        console.log(scrollablePanel.getElement('#card', true));
        // labels.push(...scrollablePanel.getElement('#card.items', true));
        /*labels.push(...scrollablePanel.getElement('#card.items', true));
        
        for (let label of labels) {
            if (!label) {
                return;
            }

            var click = scene.rexUI.add.click(label.getElement('icon'))
                .on('click', function () {
                    if (!scrollablePanel.isInTouching('mask')) {
                        return;
                    }
                    var category = label.getParentSizer().name;
                    print.text += `${category}:${label.text}\n`;
                });
        }*/
    }

    update() {}
}