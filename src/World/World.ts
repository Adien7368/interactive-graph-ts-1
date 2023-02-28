import { Constraint } from '../World/Contraint';
import { Elem } from '../World/Elem';
import { WorldGlabalValues } from '../World/Global';

class World extends WorldGlabalValues {
  constructor(
    public canvas: HTMLCanvasElement,
    public elems: Array<Elem>,
    public constraint: Array<Constraint>
  ) {
    super(canvas);
    canvas.addEventListener('mousedown', (event) => {
      this.elems.forEach((elem) =>
        elem.mouseDown(event.clientX, event.clientY)
      );
    });

    canvas.addEventListener('mousemove', (event) => {
      this.elems.forEach((elem) =>
        elem.mouseMove(event.clientX, event.clientY)
      );
    });

    canvas.addEventListener('mouseup', () => {
      this.elems.forEach((elem) => elem.mouseUp());
    });
  }

  run(): void {
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

export { World };
