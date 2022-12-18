// @ts-check

import { canvas } from "./constants.js";
import { Player } from "./player.js";

class GameScene {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;
		this.isVisible = false;

		/** @type {Player[]} */
		this.players = [];
	}

	show() {
		this.isVisible = true;
		this.draw();
	}

	hide() {
		this.isVisible = false;
	}

	draw() {}
}

export class StartScene extends GameScene {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		// when a class extends another, you need to call the
		// parent classes constructor first thing.
		super(ctx);

		/** @type {HTMLImageElement} */ //@ts-ignore
		this.image = document.getElementById("start-scene");
	}

	draw() {
		if (!this.isVisible) return;
		this.ctx.drawImage(this.image, 0, 0);
	}
}

export class GameOver extends GameScene {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		super(ctx);
	}

	draw() {
		if (!this.isVisible) return;
		const middleX = canvas.width / 2;

		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.ctx.fillStyle = "Lime";
		this.ctx.font = "200px Serpens";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";
		this.ctx.fillText("GAME OVER!", middleX, 50);

		this.ctx.fillStyle = "Yellow";
		this.ctx.font = "100px Fantasy";

		if (this.players.length === 1) {
			this.ctx.fillText(
				`Final Score: ${this.players[0].segments.length}`,
				middleX,
				250
			);
		}

		if (this.players.length === 2) {
			const p1 = this.players[0];
			const p2 = this.players[1];

			if (p1.isDead && p2.isDead) {
				this.ctx.fillText("Draw Game!", middleX, 250);
			} else if (p2.isDead) {
				this.ctx.fillText("Player 1 WINS!", middleX, 250);
			} else {
				this.ctx.fillText("Player 2 WINS!", middleX, 250);
			}

			this.ctx.fillStyle = "GoldenRod";
			this.ctx.font = "30px Fantasy";

			this.ctx.fillText("FINAL SCORES", middleX, 350);
			this.ctx.fillText(`Player 1: ${p1.segments.length}`, middleX, 385);
			this.ctx.fillText(`Player 2: ${p2.segments.length}`, middleX, 415);
		}

		this.ctx.fillStyle = "DeepSkyBlue";
		this.ctx.font = "40px Fantasy";
		this.ctx.fillText(
			"PRESS SPACE OR ENTER TO START A NEW GAME",
			canvas.width / 2,
			canvas.height - 30
		);
	}
}

export class SneakDisplay {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		this.ctx = ctx;
		/** @type {Player[]} */
		this.players = [];
	}

	update(timeElapsed) {}

	draw() {
		if (!this.players.length) return;
		this.ctx.save();
		this.ctx.globalAlpha = 0.6;
		this.ctx.font = "20px Fantasy";

		this.ctx.fillStyle = this.players[0].headColor;
		this.ctx.textAlign = "left";
		this.ctx.fillText(
			`P1 SNEAKS: ${this.players[0].sneakCount}`,
			30,
			canvas.height - 20
		);

		if (this.players.length === 2) {
			this.ctx.fillStyle = this.players[1].headColor;
			this.ctx.textAlign = "right";
			this.ctx.fillText(
				`P2 SNEAKS: ${this.players[1].sneakCount}`,
				canvas.width - 30,
				canvas.height - 20
			);
		}

		this.ctx.restore();
	}
}
