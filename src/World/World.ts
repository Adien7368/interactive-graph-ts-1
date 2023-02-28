import { distance } from '../utils';
import { CircularElem } from '../World/CircularElem';
import { Constraint } from '../World/Contraint';
import { Elem } from '../World/Elem';
import { WorldGlabalValues } from '../World/Global';

class World extends WorldGlabalValues {
  public mousePinned: Array<Elem> = [];
  constructor(
    public canvas: HTMLCanvasElement,
    public elems: Array<Elem>,
    public constraint: Array<Constraint>,
    repelForce?: number | false
  ) {
    if (repelForce === undefined) repelForce = false;
    super(canvas, repelForce);

    canvas.addEventListener('mousedown', (event) => {
      let rect = canvas.getBoundingClientRect();
      this.elems.forEach((elem) => {
        if (
          elem.mouseDown(event.clientX - rect.left, event.clientY - rect.top)
        ) {
          this.mousePinned.push(elem);
        }
      });
    });

    canvas.addEventListener('mousemove', (event) => {
      let rect = canvas.getBoundingClientRect();
      this.mousePinned.forEach((elem) =>
        elem.mouseMove(event.clientX - rect.left, event.clientY - rect.top)
      );
    });

    canvas.addEventListener('mouseup', () => {
      this.mousePinned.forEach((elem) => elem.mouseUp());
    });
  }

  repel(): void {
    if (this.allElemRepelEachOther == false) return;

    for (let i = 0; i < this.elems.length; ++i) {
      let firstElement = this.elems[i];
      if (firstElement instanceof CircularElem && !firstElement.isPinned()) {
        for (let j = i + 1; j < this.elems.length; ++j) {
          let secondElement = this.elems[j];
          if (
            secondElement instanceof CircularElem &&
            !secondElement.isPinned()
          ) {
            let dis = distance(firstElement, secondElement) + 1;

            ///  first <- second
            let force = {
              x: (firstElement.x - secondElement.x) / dis,
              y: (firstElement.y - secondElement.y) / dis,
            };
            firstElement.applyForce(
              (force.x * this.allElemRepelEachOther) / 2,
              (force.y * this.allElemRepelEachOther) / 2
            );
            secondElement.applyForce(
              (-1 * force.x * this.allElemRepelEachOther) / 2,
              (-1 * force.y * this.allElemRepelEachOther) / 2
            );
          }
        }
      }
    }
  }

  run(): void {
    let ctx = this.canvas.getContext('2d');
    if (ctx === null) return;
    let startAnimation = (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, this.width, this.height);
      this.repel();
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
