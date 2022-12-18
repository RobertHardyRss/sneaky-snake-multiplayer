//@ts-check

// This is a simple class that only has x and y coordinate
// properties.  All other classes that are placed on the canvas
// should implement this class so we can easily use this simple
// class to check for collisions.
export class Coordinates {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * @param {Coordinates} other
	 */
	isOverlapping(other) {
		return other.x == this.x && other.y == this.y;
	}
}
