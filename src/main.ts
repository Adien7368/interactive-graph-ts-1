import { generateWorldFromJSON } from './ToWorld/jsonToWorld';

// const canvas = <HTMLCanvasElement>document.getElementById('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let ctx = canvas.getContext('2d');
// if (canvas !== null && ctx !== null) {
//   const world = generateWorldFromJSON(canvas, { a: ['b', 'c'], b: [], c: [] });
//   if (world instanceof Error) throw 'Error';
//   world.runApp();
// }

function run() {
  let elem = <HTMLInputElement>document.getElementById('input');

  try {
    let json: Object = JSON.parse(elem.value);

    const fn = generateWorldFromJSON(json);
    if (fn instanceof Error) {
      throw fn;
    } else {
      let canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      let card = <HTMLElement>document.getElementById('card');
      card.remove();
      document.body.appendChild(canvas);
      const world = fn(canvas);
      world.run();
    }
  } catch (e) {
    alert('Error, check console');
    console.error(e);
  }
}
export { generateWorldFromJSON, run };
