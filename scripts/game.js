//@ts-check

import { AudioPlayer } from "./audio-player.js";
import { GRID_SIZE, canvas, ctx } from "./constants.js";
import { Coordinates } from "./coordinates.js";
import { Food } from "./food.js";
import {
	MOVE_KEYS_PLAYER_ONE,
	MOVE_KEYS_PLAYER_TWO,
	MOVE_KEYS_SINGLE_PLAYER,
} from "./movement-keys.js";
import { Player } from "./player.js";
import { GameOver, SneakDisplay, StartScene } from "./scenes.js";

// TODO: For Game
//		We need game over with play again
//			2 player end conditions
//			Final scoring is based on body length
//		Player sneak attempt counts on screen

export let game = {
	/** @type {Player[]} */
	players: [],
	playerCount: 0,
	/** @type {Food[]} */
	food: [],
	sneakDisplay: new SneakDisplay(ctx),
	startScene: new StartScene(ctx),
	gameOverScene: new GameOver(ctx),
	isGameOver: false,
	winningPlayer: 0,
	currentTime: 0,
    audioPlayer: new AudioPlayer(),

	initialize: function () {
		document.addEventListener("keydown", (e) => {
			// console.log(e.code);
			switch (e.code) {
				case "Digit1":
					if (!this.startScene.isVisible) return;
					this.playerCount = 1;
					this.start();
					break;
				case "Digit2":
					if (!this.startScene.isVisible) return;
					this.playerCount = 2;
					this.start();
					break;
				case "Space":
				case "Enter":
					if (!this.gameOverScene.isVisible) return;
					this.gameOverScene.hide();
					this.startScene.show();
					break;
			}
		});

		this.startScene.show();
	},
	start: function () {
		this.startScene.hide();
		this.audioPlayer.init();

		// find the middle of the canvas based on our grid size
		let middleOfCanvas = new Coordinates(
			Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE,
			Math.floor(canvas.height / 2 / GRID_SIZE) * GRID_SIZE
		);

		// generate players
		if (this.playerCount === 1) {
			this.players = [
				new Player(
					middleOfCanvas.x,
					middleOfCanvas.y,
					ctx,
					MOVE_KEYS_SINGLE_PLAYER
				),
			];
		} else {
			this.players = [
				new Player(
					middleOfCanvas.x - 5 * GRID_SIZE,
					middleOfCanvas.y,
					ctx,
					MOVE_KEYS_PLAYER_ONE
				),
				new Player(
					middleOfCanvas.x + 5 * GRID_SIZE,
					middleOfCanvas.y,
					ctx,
					MOVE_KEYS_PLAYER_TWO,
					"DodgerBlue",
					"DarkViolet"
				),
			];
		}

		this.sneakDisplay.players = this.players;

		// generate food
		const FOOD_COUNT = this.playerCount * 3;
		this.food = [];
		for (let i = 0; i < FOOD_COUNT; i++) {
			this.food.push(new Food(ctx));
		}

		requestAnimationFrame(gameLoop);
	},
	gameOver: function () {
		this.gameOverScene.players = this.players;
		this.gameOverScene.show();
	},
	reset: function () {},
	getGameObjectCoordinates: function () {
		// builds an array of game object coordinates based on the
		// current food array and the number of players
		if (this.players.length === 0) return [];

		/** @type {Coordinates[]} */
		let coords = [
			...this.food,
			this.players[0].head,
			...this.players[0].segments,
		];

		if (this.players.length === 2) {
			coords = coords.concat([
				this.players[1].head,
				...this.players[1].segments,
			]);
		}

		return coords;
	},
};

/**
 * @param {Player[]} players
 */
function checkIfPlayersHaveCollided(players) {
	// no need to check if we don't have two players
	if (players.length !== 2) return;
	const p1 = players[0];
	const p2 = players[1];

	const isP1OverP2 = p2.segments.some((s) => p1.head.isOverlapping(s));

	const isP2OverP1 = p1.segments.some((s) => p2.head.isOverlapping(s));

	if (isP1OverP2) {
		// player 1's head is overlapping the body of player 2
		p1.isDead = true;
	}

	if (isP2OverP1) {
		// player 2's head is overlapping the body of player 1
		p2.isDead = true;
	}

	if (p1.head.isOverlapping(p2.head)) {
		// both player's heads are overlapping, so they are both dead
		p1.isDead = p2.isDead = true;
	}
}

/**
 * @param {Player[]} players
 * @param {Food[]} food
 */
function checkIfFoodIsConsumed(players, food) {
	food.forEach((f) => {
		players.forEach((p) => {
			if (f.isOverlapping(p.head)) {
				// console.log("food is eaten");
				// food is eaten
				f.isEaten = true;
				p.grow(f);
				game.audioPlayer.eatFood();
			}
		});
	});
}

function gameLoop(/** @type {number} */ timestamp) {
	let elapsedTime = timestamp - game.currentTime;
	game.currentTime = timestamp;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	[...game.players, ...game.food, game.sneakDisplay].forEach((o) => {
		o.update(elapsedTime);
		o.draw();
	});

	checkIfPlayersHaveCollided(game.players);
	checkIfFoodIsConsumed(game.players, game.food);

	// filter out uneaten food, and then respawn food
	// that has been eaten
	game.food
		.filter((f) => f.isEaten)
		.forEach((f) => {
			f.spawn(game.getGameObjectCoordinates());
		});

	let isGameOver = game.players.some((p) => p.isDead);

	if (isGameOver) {
		game.gameOver();
		return;
	}

	requestAnimationFrame(gameLoop);
}
