//@ts-check

// TODO: Player
// we need to lose
//		when we hit another player
// Figure out how to reverse
//		HEad and tail change positions
//		Sort our segments
//		Only works if you have sneak attempts

import { GRID_SIZE, REFRESH_RATE, canvas } from "./constants.js";
import { Food } from "./food.js";
import { MoveKeys } from "./movement-keys.js";
import { Segment } from "./segment.js";

const MOVE_UP = "up";
const MOVE_DOWN = "down";
const MOVE_LEFT = "left";
const MOVE_RIGHT = "right";

export class Player {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {CanvasRenderingContext2D} ctx,
	 * @param {MoveKeys} moveKeys
	 * @param {string} headColor
	 * @param {string} bodyColor
	 */
	constructor(x, y, ctx, moveKeys, headColor = "Yellow", bodyColor = "Lime") {
		this.ctx = ctx;
		this.moveKeys = moveKeys;

		this.requestedDirection = MOVE_DOWN;
		this.currentDirection = MOVE_DOWN;

		this.headColor = headColor;
		this.bodyColor = bodyColor;

		this.head = new Segment(x, y, this.headColor, this.ctx);
		/** @type {Array<Segment>} */
		this.segments = [];
		this.sneakCount = 0;
		this.isDead = false;

		this.lastUpdate = 0;
		this.wireUpEvents();
	}

	isReverseMove() {
		if (
			this.requestedDirection == MOVE_RIGHT &&
			this.currentDirection == MOVE_LEFT
		)
			return true;
		if (
			this.requestedDirection == MOVE_LEFT &&
			this.currentDirection == MOVE_RIGHT
		)
			return true;
		if (
			this.requestedDirection == MOVE_DOWN &&
			this.currentDirection == MOVE_UP
		)
			return true;
		if (
			this.requestedDirection == MOVE_UP &&
			this.currentDirection == MOVE_DOWN
		)
			return true;

		return false;
	}

	/**
	 * @param {number} elapsedTime
	 */
	update(elapsedTime) {
		this.lastUpdate += elapsedTime;
		if (this.lastUpdate < REFRESH_RATE) return;
		this.lastUpdate = 0;

		if (this.isReverseMove()) {
			// check if reverse is available
			if (this.sneakCount > 0) {
				// valid reversaL
				this.currentDirection = this.requestedDirection;
				this.sneakCount--;
				// figure out reversal

				let headX = this.head.x;
				let headY = this.head.y;

				/** @type {Segment} */
				//@ts-ignore
				let tail = this.segments.pop();

				this.segments = this.segments.reverse();

				this.head.x = tail.x;
				this.head.y = tail.y;

				tail.x = headX;
				tail.y = headY;

				this.segments.push(tail);
			}
		} else {
			this.currentDirection = this.requestedDirection;
		}

		for (let i = this.segments.length - 1; i >= 1; i--) {
			this.segments[i].x = this.segments[i - 1].x;
			this.segments[i].y = this.segments[i - 1].y;
		}

		if (this.segments.length > 0) {
			this.segments[0].x = this.head.x;
			this.segments[0].y = this.head.y;
		}

		switch (this.currentDirection) {
			case MOVE_DOWN:
				this.head.y += GRID_SIZE;
				break;
			case MOVE_UP:
				this.head.y -= GRID_SIZE;
				break;
			case MOVE_RIGHT:
				this.head.x += GRID_SIZE;
				break;
			case MOVE_LEFT:
				this.head.x -= GRID_SIZE;
				break;
		}

		// check for death
		if (
			this.head.x < 0 ||
			this.head.y < 0 ||
			this.head.x >= canvas.width ||
			this.head.y >= canvas.height ||
			this.segments.some((s) => s.x == this.head.x && s.y == this.head.y)
		) {
			this.isDead = true;
		}
	}

	draw() {
		// if(this.isDead) return;

		this.head.draw();
		this.segments.forEach((s) => {
			s.draw();
		});
	}

	wireUpEvents() {
		document.addEventListener("keydown", (e) => {
			switch (e.code) {
				case this.moveKeys.up:
				case this.moveKeys.upAlt:
					this.requestedDirection = MOVE_UP;
					break;
				case this.moveKeys.down:
				case this.moveKeys.downAlt:
					this.requestedDirection = MOVE_DOWN;
					break;
				case this.moveKeys.right:
				case this.moveKeys.rightAlt:
					this.requestedDirection = MOVE_RIGHT;
					break;
				case this.moveKeys.left:
				case this.moveKeys.leftAlt:
					this.requestedDirection = MOVE_LEFT;
					break;
			}
		});
	}

	/**
	 * @param {Food} food
	 */
	grow(food) {
		for (let i = 0; i < food.growBy; i++) {
			this.segments.push(
				new Segment(this.head.x, this.head.y, this.bodyColor, this.ctx)
			);
		}
		this.sneakCount += food.sneakAttempts;
	}
}
