//@ts-check
/** @type {HTMLCanvasElement} */ //@ts-ignore canvas is an HTMLCanvasElement
export const canvas = document.getElementById("game-canvas");
/** @type {CanvasRenderingContext2D} */ //@ts-ignore canvas is an HTMLCanvasElement
export const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

export const GRID_SIZE = 20;
export const REFRESH_RATE = 100;
