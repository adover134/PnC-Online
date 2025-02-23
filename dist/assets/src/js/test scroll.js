import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
export class TestScroll extends ScrollablePanel {
    constructor(scene, x, y, id, children) {
        super(scene, config);
        console.log(this);
    }
}

var data = {
    name: 'Rex',
    skills: [
        { name: 'A' },
    ],

};

var config = {
    x: 700,
    y: 300,
    width: 210,
    height: 420,

    scrollMode: 0,

    background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

    panel: {
        child: createPanel(this, data),

        mask: {
            padding: 1,
            // layer: this.add.layer()
        },
    },

    slider: {
        // x, y, width, height, radius, color
        track: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_DARK),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
    },

    // scroller: true,
    scroller: {
        // pointerOutRelease: false
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

        panel: 10,
        // slider: { left: 30, right: 30 },
    }
};