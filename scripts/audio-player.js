/** @type {HTMLAudioElement} */
let eatFood = document.getElementById("sfx-eat");

//@ts-check
export class AudioPlayer {
	constructor() {
		/** @type {AudioContext | undefined} */
		this.ctx;
	}

	init() {
		if (!this.ctx) {
			this.ctx = new AudioContext();
		}

		if (this.ctx.state === "suspended") {
			this.ctx.resume();
		}
	}

	eatFood() {
		eatFood.cloneNode(true).play();
	}
}
