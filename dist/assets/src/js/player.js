import { io } from "socket.io-client";
import { CardSystem } from "./card_system.js";
import { CardSelectZone } from "./card select zone.js";
import * as cookie from "./cookie.js";
import { Button } from "./button.js";

export var player = {};

player.socket = io.connect('http://localhost:5500');
player.load = false;
player.game = null;
player.opponent_name = null;
player.waiting = false;
player.cardsys = new CardSystem();

player.setUserName = function(newName) {
    player.username = newName;
};

player.setGame = function(game) {
    player.game = game;
};

player.askNewPlayer = function(){
    player.socket.emit('New Player Connect');
};

player.askReturnPlayer = function(username){
    player.socket.emit('Return Player Connect', username)
};

player.findMatch = function(){
    player.socket.emit('Matchmake Start');
};

player.leaveGame = function() {
    player.socket.emit('leavegame');
}

player.socket.on('setName', function(name) {
    player.setUserName(name);
    cookie.setCookie("username", name);
});

player.socket.on('Deck Length Error', function(count) {
    console.log(`Deck should have 20 cards! Your deck has ${count} cards!`);
});

player.socket.on('Wait For Match',function() {
    player.waiting = true;
    player.game.scene.getScene('TitleScene').time.delayedCall(1000, () => {
        player.game.scene.getScene('TitleScene').scene.start('WaitingScene');
    });
});

player.socket.on('Turn Set',function(turn) {
    if (turn === 'first') {
        player.cardsys.turn = true;
    }
    else {
        player.cardsys.turn = false;
    }
    // 플레이어의 핸드를 핸드 위치로 옮겨둔다.
    player.game.scene.getScene('GameScene').time.delayedCall(100, () => {
        player.game.scene.getScene('GameScene').spawnCards();
    });
    // 대기 화면이라면 WaitingScene에서 이동한다.
    if (player.waiting === true)
    {
        player.game.scene.getScene('WaitingScene').time.delayedCall(1000, () => {
            player.game.scene.getScene('WaitingScene').scene.start('GameScene');
        });
    }
    else {
        // GameScene으로 이동한다.
        player.game.scene.getScene('TitleScene').time.delayedCall(1000, () => {
            player.game.scene.getScene('TitleScene').scene.start('GameScene');
        });
    }
});

player.socket.on('Match Init', function(data) {
    player.cardsys.match_init(player.game.scene.getScene('GameScene'), data.deck, data.opponent_deck);
});

player.socket.on('Hand Init', function(hand) {
    player.cardsys.hand_add_cards(hand);
    player.socket.emit('Match Ready');
});

player.socket.on('Hand Add', function(data) {
    let g = player.game.scene.getScene('GameScene');
    player.cardsys.cards.forEach((Card) => {
        Card.setPosition(-1000, -1000);
    });
    let hand = data.hand;
    let purpose = data.purpose;
    player.cardsys.hand_add_cards(hand);
    g.spawnCards();
    if (purpose === 'ready') {
        g.Phase = 1;
        var messagebox = new Button(g, 500, 300);
        messagebox.setSize(980, 100);
        messagebox.set_color(g, 0xaa00ff);
        messagebox.set_text(g, 'Main Phase!', '96px', '#0f0');
        messagebox.setDepth(10);
        g.input.enabled = false;
        g.time.delayedCall(1000, () => {
            messagebox.destroy();
            g.input.enabled = true;
        });
    }
});

player.socket.on('Ask Cost', function(data) {
    let g = player.game.scene.getScene('GameScene');
    console.log(data);
    // 점수를 조정하는 경우
    if (data.info.target === 0){
        if (typeof data.info.value !== 'number')
        {

        }
        else {
            player.socket.emit('cost submit', {d_id: data.id, info: data.info.value});
        }
    }
    // 핸드로부터 카드를 받아야 한다면
    if (data.info.target === 1){
        // cost.value 범위에 해당하는 수만큼의 카드를 받는 카드 제출 창을 생성한다.
        // 만약 player가 0이면 본인의 핸드에서, 1이면 상대 핸드에서 골라야 하며
        // 상대 핸드에서 고를 시 뒷면만 보고 고르도록 한다.

        // 핸드에 해당하는 카드들의 이미지를 갖는 창을 띄우는 건?
        // 우선 핸드의 카드들의 클릭 가능 여부를 제거하고
        g.HAND_AREA.disable_interactive();
        // 카드 선택 존은 자체적으로 검증 기능과 선택 정보 전송 기능을 갖도록 하자.
        // 자신 핸드에서 골라야한다면 자신 핸드의 카드들로 구성되는 선택 존을 띄운다.
        if (data.info.player === 0)
            g.cardSelects.init(g, 500, 300, 'p', data, 'cost');
        // 상대 핸드에서 골라야 한다면 상대 핸드의 카드 수만큼의 뒷면으로 구성되는 선택 존을 띄운다.
        else
            g.cardSelects.init(g, 500, 300, 'o', data, 'cost');

    }
    // 보드의 조각들을 선택해서 수행해야 한다면
    else if (data.info.target === 4){
        
    }

    // 이외의 경우, 별도의 정보가 필요하지 않으니 생략한다.
    else {

    }
});

player.socket.on('Ask Effect', function(data) {
    let g = player.game.scene.getScene('GameScene');
    if (data.info.target === 0) {
        console.log('yo!!!');
        player.socket.emit('effect submit', {d_id: data.id, info: data.info});
    }
    // 핸드로부터 카드를 받아야 한다면
    else if (data.info.target === 1){
        // cost.value 범위에 해당하는 수만큼의 카드를 받는 카드 제출 창을 생성한다.
        // 만약 player가 0이면 본인의 핸드에서, 1이면 상대 핸드에서 골라야 하며
        // 상대 핸드에서 고를 시 뒷면만 보고 고르도록 한다.

        // 핸드에 해당하는 카드들의 이미지를 갖는 창을 띄우는 건?
        // 카드 선택 존은 자체적으로 검증 기능과 선택 정보 전송 기능을 갖도록 하자.
        // 자신 핸드에서 골라야한다면 자신 핸드의 카드들로 구성되는 선택 존을 띄운다.
        if (data.info.player === 0)
            g.cardSelects.init(g, 500, 300, 'p', data, 'cost');
        // 상대 핸드에서 골라야 한다면 상대 핸드의 카드 수만큼의 뒷면으로 구성되는 선택 존을 띄운다.
        else
            g.cardSelects.init(g, 500, 300, 'o', data, 'cost');
    }
    if (data.info.target === 2) {
        if (typeof data.info.value !== 'number'){

        }
        // 장 수가 정해져 있다면
        else {
            player.socket.emit('effect submit', {d_id: data.id, info: data.info});
        }
    }
});

player.socket.on('Ready Trash', function(data){
    let g = player.game.scene.getScene('GameScene');
    g.cardSelects.init(g, 500, 300, 'p', data, data.purpose);    
    if (data.purpose === 'ready') {
        g.Phase = 1;
        var messagebox = new Button(g, 500, 300);
        messagebox.setSize(980, 100);
        messagebox.set_color(g, 0xaa00ff);
        messagebox.set_text(g, 'Main Phase!', '96px', '#0f0');
        g.input.enabled = false;
        g.time.delayedCall(1000, () => {
            messagebox.destroy();
            g.HAND_AREA.position_init();
            g.input.enabled = true;
        });
    }
});

player.socket.on('Trash From Hand', function(data) {
    let g = player.game.scene.getScene('GameScene');
    player.cardsys.trash_from_hand(data.chosen_cards);
    g.HAND_AREA.position_init();
    player.cardsys.cards.forEach((Card) => {
        Card.setPosition(-1000, -1000);
    });
    g.spawnCards();
});

player.socket.on('Return Card To Hand', function(data){
    let g = player.game.scene.getScene('GameScene');

    let used_card = player.cardsys.cards.find(function(card) {
        return card.d_id === data.id;
    });
    used_card.x = used_card.getData('startX');
    used_card.y = used_card.getData('startY');
    if (data.cause === 'Condition')
    {
        var messagebox = new Button(g, 500, 300);
        messagebox.setSize(980, 100);
        messagebox.set_color(g, 0xaa00ff);
        messagebox.set_text(g, '사용 조건을 만족하지 않았습니다.', '96px', '#0f0');
        g.input.enabled = false;
        g.time.delayedCall(1000, () => {
            messagebox.destroy();
            g.input.enabled = true;
        });
    }
    else if (data.cause === 'Cost')
    {
        var messagebox = new Button(g, 500, 300);
        messagebox.setSize(980, 100);
        messagebox.set_color(g, 0xaa00ff);
        messagebox.set_text(g, '코스트를 지불할 수 없습니다.', '96px', '#0f0');
        g.input.enabled = false;
        g.time.delayedCall(1000, () => {
            messagebox.destroy();
            g.input.enabled = true;
        });
    }
});

player.socket.on('block info', function(data) {
    let g = player.game.scene.getScene('GameScene');
    // 사용한 카드를 찾는다.
    let used_card = player.cardsys.cards.find(function(card) {
        return card.d_id === data.card;
    });
    // 그 카드를 핸드에서 없앤다.
    player.cardsys.hand = player.cardsys.hand.filter((Card) => Card !== used_card);
    // 대신 trash에 넣는다.
    player.cardsys.trash.push(used_card);
    player.cardsys.using_card = null;

    player.cardsys.cards.forEach((Card) => {
        Card.setPosition(-1000, -1000);
    });
    
    var messagebox = new Button(g, 500, 300);
    messagebox.setSize(980, 100);
    messagebox.set_color(g, 0xaa00ff);
    messagebox.set_text(g, 'Placement Phase!', '96px', '#0f0');
    messagebox.setDepth(10);
    g.input.enabled = false;
    g.time.delayedCall(1000, () => {
        messagebox.destroy();
    });

    player.cardsys.blocks = data.blocks;

    g.time.delayedCall(1000, () => {
        g.spawnPieces(player.cardsys.blocks);
        g.time.delayedCall(500, () => {
            g.input.enabled = true;
        });
    });
});

player.socket.on('opponent block place', function(data) {
    let g = player.game.scene.getScene('GameScene');
    data.block.forEach((p) => {
        g.Grid[data.point[0] + p[0]-1][data.point[1] + p[1]-1] = 1; // Mark grid as filled
        const block = g.add.rectangle(
            g.BOARD_OFFSET_X+10 + 2.5 + (data.point[1] + p[1]-1) * g.TILE_SIZE,
            g.BOARD_OFFSET_Y+10 + 2.5 + (data.point[0] + p[0]-1) * g.TILE_SIZE,
            g.TILE_SIZE - 5, g.TILE_SIZE - 5, 0x11aacc
        );
        block.setDepth(0);
        block.setOrigin(0, 0);
        g.grid[data.point[0]+p[0]-1][data.point[1]+p[1]-1] = block;
    });
    player.socket.emit('placement done');
});

player.socket.on('My Score Update', function(data){
    let g = player.game.scene.getScene('GameScene');
    g.MyscoreText.setText(`My Score : ${data.score}`);
});

player.socket.on('Opponent Score Update', function(data){
    let g = player.game.scene.getScene('GameScene');
    g.OpponentscoreText.setText(`Op Score : ${data.score}`);
});

player.socket.on('score change', function(data) {
    let g = player.game.scene.getScene('GameScene');
    g.MyscoreText.setText(`My Score : ${data.score}`);
    g.OpponentscoreText.setText(`Op Score : ${data.opponent_score}`);
});

player.socket.on('scoring end', function(data) {
    let g = player.game.scene.getScene('GameScene');
    g.MyscoreText.setText(`My Score : ${data.score}`);
    g.OpponentscoreText.setText(`Op Score : ${data.opponent_score}`);
    data.points.forEach((p) => {
        g.Grid[p[0]][p[1]] = 0; // 그리드 비우기
        g.grid[p[0]][p[1]].destroy();
        g.grid[p[0]][p[1]] = null; // 그리드 비우기
    });
    player.socket.emit('destruction done');
});
player.socket.on('next turn', function() {
    let g = player.game.scene.getScene('GameScene');
    if (player.cardsys.turn) player.cardsys.turn = false;
    else player.cardsys.turn = true;
    player.cardsys.turn_num = player.cardsys.turn_num + 1;
    g.turnChange(player.cardsys.turn);
    g.time.delayedCall(1000, () => {
        if (player.cardsys.turn)
            player.socket.emit('hand check');
    });
});

player.socket.on('card info', function(data) {
    let g = player.game.scene.getScene('GameScene');
    g.INFO_AREA.setInfo(data.id, data.desc);
});

// 매치가 종료되었다는 신호를 받았을 때
player.socket.on('match end', function(data) {
    console.log('heohrwoe', data);
    let g = player.game.scene.getScene('GameScene');
    g.gameOver(data);
});