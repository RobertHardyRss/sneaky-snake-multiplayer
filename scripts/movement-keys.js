//@ts-check

const ARROW_UP = "ArrowUp";
const ARROW_DOWN = "ArrowDown";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const KEY_W = "KeyW";
const KEY_A = "KeyA";
const KEY_S = "KeyS";
const KEY_D = "KeyD";

export class MoveKeys {
	constructor() {
		this.up = ARROW_UP;
		this.upAlt = KEY_W;
		this.down = ARROW_DOWN;
		this.downAlt = KEY_S;
		this.right = ARROW_RIGHT;
		this.rightAlt = KEY_D;
		this.left = ARROW_LEFT;
		this.leftAlt = KEY_A;
	}
}

/**
 * @param {MoveKeys} keys
 */
function clearAlternateMoves(keys) {
	keys.upAlt = "";
	keys.downAlt = "";
	keys.rightAlt = "";
	keys.leftAlt = "";
}

/**
 * @param {MoveKeys} keys
 */
function setToArrows(keys) {
	clearAlternateMoves(keys);
	keys.up = ARROW_UP;
	keys.down = ARROW_DOWN;
	keys.right = ARROW_RIGHT;
	keys.left = ARROW_LEFT;
}

/**
 * @param {MoveKeys} keys
 */
function setToWasd(keys) {
	clearAlternateMoves(keys);
	keys.up = KEY_W;
	keys.down = KEY_S;
	keys.right = KEY_D;
	keys.left = KEY_A;
}

const MOVE_KEYS_SINGLE_PLAYER = new MoveKeys();
const MOVE_KEYS_PLAYER_ONE = new MoveKeys();
const MOVE_KEYS_PLAYER_TWO = new MoveKeys();

setToWasd(MOVE_KEYS_PLAYER_ONE);
setToArrows(MOVE_KEYS_PLAYER_TWO);

export { MOVE_KEYS_SINGLE_PLAYER, MOVE_KEYS_PLAYER_ONE, MOVE_KEYS_PLAYER_TWO };
