import { CircularElem, renderCircularElem } from './World/CircularElem';
import { WorldGlabalValues } from './World/Global';
import { LineContraint, renderEdges } from './World/LineContraint';

class App extends WorldGlabalValues {
  constructor(
    public canvas: HTMLCanvasElement,
    public elems: Array<Elem>,
    public constraint: Array<Constraint>
  ) {
    super(canvas);
  }
  runApp(): void {
    debugger;
    let ctx = this.canvas.getContext('2d');
    if (ctx === null) return;
    let startAnimation = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, this.width, this.height);
      this.elems.forEach((e) => e.update(this.width, this.height));
      this.constraint.forEach((cons) => cons.update());
      this.constraint.forEach((cons) => cons.render(ctx));
      this.elems.forEach((e) => e.render(ctx));
      requestAnimationFrame(() => startAnimation(ctx));
    };
    startAnimation(ctx);
  }
}

const canvas = <HTMLCanvasElement>document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext('2d');
if (canvas !== null && ctx !== null) {
  const render = renderCircularElem(1, 'grey', 'black', 'no_name');

  const render4 = renderCircularElem(1, 'grey', 'black', 'no_name6');
  const lineRender = renderEdges('black', 1);

  const elem = new CircularElem(100, 100, 50, 50, false, 10, render);

  const elem2 = new CircularElem(500, 610, 59, 500, false, 10, render4);
  const cons = new LineContraint(elem, elem2, 100, 0.5, lineRender);
  const app = new App(canvas, [elem, elem2], [cons]);
  app.runApp();
}

export { App };
