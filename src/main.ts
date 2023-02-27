import { generateWorldFromJSON } from './ToWorld/jsonToWorld';

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');
if (canvas !== null && ctx !== null) {
  const world = generateWorldFromJSON(canvas, { a: ['b', 'c'], b: [], c: [] });
  if (world instanceof Error) throw 'Error';
  world.runApp();
}
