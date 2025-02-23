import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { CardImage } from './card image.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;

export class InfoZone extends ScrollablePanel {
    constructor (scene, x, y, width, height) {
        let Card =  new CardImage(scene, 0, 0, 0, 210, 280);
        let Text = scene.add.text(0, 0, '', {
            fontSize: '16px',
            fontFamily: "'Noto Sans KR', sans, serif",
            fixedWidth: 210,
            wordWrap: {width: 210},
            color: '#ffffff'
        });
        Text.setDepth(3);
        console.log(Text instanceof Phaser.GameObjects.Text);
        let config = get_config(scene, x, y, width, height, Card, Text);

        super (scene, config);

        this.Card = Card;
        this.Card.setOrigin(1);
        this.Card.setVisible(false);
        this.Text = Text;
    }
    
    setInfo(id, text='') {
        console.log('what the', text);
        console.log(this.Text instanceof Phaser.GameObjects.Text);
        this.Card.setTexture('cards', id);
        this.Card.setVisible(true);
        this.Text.setText(text);
    }
}

var get_config = function (scene, x, y, width, height, Card, Text) {

    return {
        x: x,
        y: y,
        width: width,
        height: height,

        scrollMode: 0,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

        panel: {
            child: createPanel(scene, Card, Text),

            mask: {
                padding: 1,
            },
        },
  
        mouseWheelScroller: {
            focus: false,
            speed: 0.1
        },

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        }
    };
}

var createPanel = function (scene, Card, Text) {
    var Card = createCard(scene, 'card', Card, Text);
    return scene.rexUI.add.sizer({
        orientation: 'y',
    })
        .add(
            Card,
            { expand: true }
        );
}

var createCard = function (scene, key, Card, Text) {

    var image = scene.add.container(0, 0, [
        Card
    ]).setSize(210, 280);

    var header = scene.rexUI.add.label({
        orientation: 'y',
      
        icon: image,

        space: { bottom: 5},
    });

    var text = scene.rexUI.add.label({
        orientation: 'y',
        text: Text
    });

    return scene.rexUI.add.sizer({
        orientation: 'y',
        name: 'card',
        height: 0
    })
        .addBackground(
            scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1)
        )
        .add(header,
            { proportion: 1, expand: true }
        )
        .add(
            text,
            { expand: true, align: 'center' }
        );
};