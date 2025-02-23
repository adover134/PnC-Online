import { Button } from "./button.js";
import { player } from "./player.js";

export class GameOverBox extends Button {
    
    constructor(scene) {
        super (scene, -2000, -2000);
        this.setSize(600, 600);
        this.set_color(scene, 0xffb366);
        this.setDepth(7);
        this.Result = new Button(scene, 0, -210);
        this.Result.setSize(450, 120);
        this.Result.set_color(scene, 0xffffff);
        this.add(this.Result);
        this.Result.text = scene.add.text(0, 0, '패배하셨습니다!', {
            fontSize: '32px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#000000',
            verticalAlign: 'middle'
        });
        this.Result.text.setOrigin(0.5);
        this.Result.add(this.Result.text);

        this.Score = new Button(scene, 0, -45);
        this.Score.setSize(450, 150);
        this.Score.set_color(scene, 0xffffff);
        this.add(this.Score);
        this.Score.text = scene.add.text(0, 0, `당신의 점수 : ~점\n\n상대의 점수 : ~점`, {
            fontSize: '32px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#000000',
            verticalAlign: 'middle'
        });
        this.Score.text.setAlign('center');
        this.Score.text.setOrigin(0.5);
        this.Score.add(this.Score.text);

        this.Friend = new Button(scene, -125, 105);
        this.Friend.setSize(200, 90);
        this.Friend.set_color(scene, 0xffffff);
        this.add(this.Friend);
        this.Friend.text = scene.add.text(0, 0, 'Friend Request', {
            fontSize: '24px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#000000',
            verticalAlign: 'middle'
        });
        this.Friend.text.setOrigin(0.5);
        this.Friend.add(this.Friend.text);
        this.Friend.setInteractive();
        
        this.Thanks = new Button(scene, 125, 105);
        this.Thanks.setSize(200, 90);
        this.Thanks.set_color(scene, 0xffffff);
        this.add(this.Thanks);
        this.Thanks.text = scene.add.text(0, 0, 'Good Game!', {
            fontSize: '28px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#000000',
            verticalAlign: 'middle'
        });
        this.Thanks.text.setOrigin(0.5);
        this.Thanks.add(this.Thanks.text);
        this.Thanks.setInteractive();

        this.Log = new Button(scene, -125, 225);
        this.Log.setSize(200, 90);
        this.Log.set_color(scene, 0xffffff);
        this.add(this.Log);
        this.Log.text = scene.add.text(0, 0, 'Save Log', {
            fontSize: '28px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#000000',
            verticalAlign: 'middle'
        });
        this.Log.text.setOrigin(0.5);
        this.Log.add(this.Log.text);
        this.Log.setInteractive();
        
        this.Main = new Button(scene, 125, 225);
        this.Main.setSize(200, 90);
        this.Main.set_color(scene, 0xffffff);
        this.add(this.Main);
        this.Main.text = scene.add.text(0, 0, 'To Main', {
            fontSize: '28px',
            fontFamily: "'Noto Sans KR', sans, serif",
            color: '#000000',
            verticalAlign: 'middle'
        });
        this.Main.text.setOrigin(0.5);
        this.Main.add(this.Main.text);
        this.Main.setInteractive();

        this.Main.on('pointerdown', (pointer) => {
            console.log('hohohoho!', this.Main);
            scene.scene.stop();
            scene.game.scene.start('TitleScene');
        });
    }

    showBox(data) {
        this.setPosition(500, 300);
        if (data.result === 'win')
            this.Result.text.setText('승리하셨습니다!');
        else if (data.result === 'lose')
            this.Result.text.setText('패배하셨습니다...');
        else if (data.result === 'draw')
            this.Result.text.setText('비겼습니다.');
        this.Score.text.setText(`당신의 점수 : ${data.p_score}점\n\n상대의 점수 : ${data.op_score}점`);
    }
}