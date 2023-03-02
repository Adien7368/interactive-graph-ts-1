import { distance } from '../utils';
import { CircularElem } from '../World/CircularElem';
import { Constraint } from '../World/Contraint';
import { Elem } from '../World/Elem';
import { WorldGlabalValues } from '../World/Global';
import { LineContraint } from '../World/LineContraint';

class World extends WorldGlabalValues {
  public mousePinned: Elem | undefined;
  constructor(
    public canvas: HTMLCanvasElement,
    public elems: Array<Elem>,
    public constraint: Array<Constraint>,
    repelForce?: number | false
  ) {
    if (repelForce === undefined) repelForce = false;
    super(canvas, repelForce);

    window.addEventListener('keydown', (event) => {
      if (event.code == 'KeyD') {
        if (this.mousePinned) {
          this.mousePinned.mouseUp();
          this.elems = this.elems.filter((e) => e != this.mousePinned);
          this.constraint = this.constraint.filter((c) => {
            if (
              c instanceof LineContraint &&
              this.mousePinned instanceof CircularElem
            ) {
              return (
                c.elem1_pointer !== this.mousePinned &&
                this.mousePinned !== c.elem2_pointer
              );
            }
            return true;
          });
        }
      }
    });

    canvas.addEventListener('mousedown', (event) => {
      let rect = canvas.getBoundingClientRect();
      this.elems.forEach((elem) => {
        if (this.mousePinned) return;
        if (
          elem.mouseDown(event.clientX - rect.left, event.clientY - rect.top)
        ) {
          this.mousePinned = elem;
        }
      });
    });

    canvas.addEventListener('mousemove', (event) => {
      if (this.mousePinned) {
        let rect = canvas.getBoundingClientRect();
        this.mousePinned.mouseMove(
          event.clientX - rect.left,
          event.clientY - rect.top
        );
      }
    });

    canvas.addEventListener('mouseup', () => {
      if (this.mousePinned) this.mousePinned.mouseUp();
      this.mousePinned = undefined;
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
