//@ts-check

import { GRID_SIZE, canvas } from "./constants.js";
import { Coordinates } from "./coordinates.js";

// TODO: Food
// How many food spawn?
//  	Make it configurable?

export class Food extends Coordinates {
	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	constructor(ctx) {
		super(0, 0);
		this.ctx = ctx;
		this.radius = GRID_SIZE / 2;
		this.color = "red";
		this.growBy = 1;
		this.sneakAttempts = 0;
		this.isEaten = true;
	}

	/**
	 * @param {Coordinates[]} occupiedSpaces
	 */
	spawn(occupiedSpaces) {
		// reset eaten state
		this.isEaten = false;
		this.setFoodType();
		this.setRandomLocation(occupiedSpaces);
	}

	/**
	 * @param {Coordinates[]} occupiedSpaces
	 */
	setRandomLocation(occupiedSpaces) {
		let randomLocation = this.getRandomSpawnLocation();

		const MAX_TRIES = 10;
		let tryCount = 1;
		do {
			let isOverlapping = occupiedSpaces.some((c) =>
				c.isOverlapping(randomLocation)
			);

			if (isOverlapping) {
				randomLocation = this.getRandomSpawnLocation();
				tryCount++;
			} else {
				// since we found a spot that is available,
				// we can "break" out of our do-while loop.
				break;
			}
		} while (tryCount <= MAX_TRIES);

		this.x = randomLocation.x * GRID_SIZE;
		this.y = randomLocation.y * GRID_SIZE;
	}

	getRandomSpawnLocation() {
		let xGridMaxValue = canvas.width / GRID_SIZE;
		let yGridMaxValue = canvas.height / GRID_SIZE;
		let randomX = Math.floor(Math.random() * xGridMaxValue);
		let randomY = Math.floor(Math.random() * yGridMaxValue);

		return new Coordinates(randomX, randomY);
	}

	setFoodType() {
		let foodType = Math.floor(Math.random() * 8 + 1);
		switch (foodType) {
			case 1:
				this.color = "gold";
				this.growBy = 3;
				this.sneakAttempts = 2;
				break;
			case 2:
			case 3:
			case 4:
				this.color = "blue";
				this.growBy = 2;
				this.sneakAttempts = 1;
				break;
			default:
				this.color = "red";
				this.growBy = 1;
				break;
		}
	}

	/**
	 * @param {number} elapsedTime
	 */
	update(elapsedTime) {
		// TODO: give food a glowing effect that radiates
	}

	draw() {
		if (this.isEaten) return;

		this.ctx.beginPath();
		this.ctx.fillStyle = this.color;
		this.ctx.arc(
			this.x + this.radius,
			this.y + this.radius,
			this.radius,
			0,
			Math.PI * 2
		);
		this.ctx.fill();
		this.ctx.closePath();
	}
}
