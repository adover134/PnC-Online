class mainDeck {
    constructor(slot, card, op, parent) {
        var d = card.index;
        var game = Client.game;
        this.parent = parent;
        this.isOpponents = op;
        this.obj = game.add.button(
            slot.obj.x, 
            slot.obj.y, 
            'cards',
            this.click,
            this
        );
        this.obj.anchor.setTo(0.5, 0.5);
        this.obj.height = 140;
        this.obj.width = 104;
        this.obj.angle = 90;
        if(op) { this.obj.angle *= -1; }
        
        this.text = game.add.text(
            slot.obj.x, 
            slot.obj.y, 
            "0", {
            font: "16px Courier New",
            fill: "#ffffff",
            stroke: '#000000',
            align: "left"
        });
        this.text.strokeThickness = 4;
        this.text.anchor.setTo(0.5, 0.5);

        this.card = card;
        if(this.card.type != CardType.MEMBER) {
            this.text.text = "";
        }
        this.revealed = !this.isOpponents;
        card.obj = this;
        this.game = game;
        this.ls = Client;
        this.slot = slot;
        this.channel = null;
        this.state = game.state.getCurrentState();
        this.parent.add(this.obj);
    }

    click() {
        var local = this.ls.cardsys.duel.local;
        var duel = this.ls.cardsys.duel;
		if(Game.waitAnim || Game.inputLayer > 0) return;
        if(this.isOpponents) {
            //this.draw();
			return;
        }
        if(duel.phase === DuelPhase.DRAW) {
            if(this.slot.type === SlotType.DECK) {
                if(duel.draws < 1) {
                    this.draw();
                }
            }
            return;
        }
        if(this.slot !== null) {
            //Client.sendMove("SURRENDER");
        }
    }

    draw(cb=function(duel){}) {
        var duel = this.ls.cardsys.duel;
		var game = this.ls.game;
        var sounds = this.ls.sounds;
        if(duel.phase == DuelPhase.DRAW) {
            Client.sendMove("DRAW 1");
        }
        if(this.isOpponents) {
			var next = new CardObject(this.slot, duel.opponent.deck.get_top(), this.isOpponents, this.parent);
		    next.revealed = true;
			this.parent.bringToTop(next.obj);
			//obj.remote.hand.push(next);
			//obj.remote.hand.updateHandPositions();
			duel.remote.hand.push(next);
			Game.addToHand(next, this.isOpponents);
			Game.updateHand(cb);
			var n = getRandomInt(1, 3);
			if(n == 1) {
				sounds['card1'].play();
			} else if(n == 2) {
				sounds['card0'].play();
			} else {
				sounds['card3'].play();
			}
			//duel.remote.hand.updateHandPositions();
            next.slot = null;
            duel.opponent.deck.draw();
        } else {
            var next = new CardObject(this.slot, duel.player.deck.get_top(), this.isOpponents, this.parent);
            this.parent.bringToTop(next.obj);
            //this.state.obj.local.deck = next;
            //next.move({
            //    x: 104,
            //    y: (duel.local.hand.length * 104) + 132
            //});
			//obj.local.hand.push(next);
			//obj.local.hand.updateHandPositions();
            duel.local.hand.push(next);
			Game.addToHand(next, this.isOpponents);
			Game.updateHand(cb);
			var n = getRandomInt(1, 3);
			if(n == 1) {
				sounds['card1'].play();
			} else if(n == 2) {
				sounds['card0'].play();
			} else {
				sounds['card3'].play();
			}
			//duel.local.hand.updateHandPositions();
            next.slot = null;
			duel.player.deck.draw();
            duel.draws++;
            if(duel.draws >= 1) {
                duel.phase = DuelPhase.EFFECT;
                duel.effectPhase();
            }
        }
    }

    move(dest) {
        //var distance = Phaser.Math.distance(this.obj.x, this.obj.y, dest.x, dest.y);
        var duration = 250;
        var local = this.ls.cardsys.duel.local;
        local.selected = null;
        this.obj.input.enabled = false;
        var tween = this.game.add.tween(this.obj).to(dest, duration, Phaser.Easing.Quadratic.InOut);
        tween.onComplete.addOnce(function(obj, tween) {
            obj.input.enabled = true;
        });
        tween.start();

        var tween2 = this.game.add.tween(this.text).to(dest, duration, Phaser.Easing.Quadratic.InOut);
        tween2.onComplete.addOnce(function(obj, tween2) {
        });
        tween2.start();
    }

    update() {
        this.obj.frame = UNDEFINED_CARD_INDEX;
        if(this.isOpponents) {
            this.text.setText(`${Client.cardsys.duel.opponent.deck.card.length}`);
        }
        else {
            this.text.setText(`${Client.cardsys.duel.player.deck.card.length}`);
        }
    }
}