import { CircularElem } from '../World/CircularElem';

function distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

class LineContraint {
  elems: Array<Elem> = [];
  constructor(
    public elem1_pointer: CircularElem,
    public elem2_pointer: CircularElem,
    public distance: number | 'dynamic',
    public elasticity = 0.5,
    public renderOverride: (
      ctx: CanvasRenderingContext2D,
      cons: LineContraint
    ) => void
  ) {}
  update() {
    if (this.distance == 'dynamic') return;
    let currDistance =
      distance(this.elem1_pointer, this.elem2_pointer) < 0.001
        ? 0.001
        : distance(this.elem1_pointer, this.elem2_pointer);
    let dl = currDistance - this.distance;
    let dx = this.elem1_pointer.x - this.elem2_pointer.x;
    let dy = this.elem1_pointer.y - this.elem2_pointer.y;
    let offsetX = (this.elasticity * dl * dx) / (2 * currDistance);
    let offsetY = (this.elasticity * dl * dy) / (2 * currDistance);
    if (!this.elem1_pointer.pinned) {
      this.elem1_pointer.x -= offsetX;
      this.elem1_pointer.y -= offsetY;
    }
    if (!this.elem2_pointer.pinned) {
      this.elem2_pointer.x += offsetX;
      this.elem2_pointer.y += offsetY;
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    this.renderOverride(ctx, this);
  }
}

function renderEdges(color: string, strokeWidth: number) {
  return function (ctx: CanvasRenderingContext2D, cons: LineContraint) {
    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    let dis = distance(cons.elem1_pointer, cons.elem2_pointer);

    let dx = (cons.elem1_pointer.x - cons.elem2_pointer.x) / dis;
    let dy = (cons.elem1_pointer.y - cons.elem2_pointer.y) / dis;
    canvas_arrow(
      ctx,
      cons.elem1_pointer.x - dx * cons.elem2_pointer.radius,
      cons.elem1_pointer.y - dy * cons.elem1_pointer.radius,
      cons.elem2_pointer.x + dx * cons.elem2_pointer.radius,
      cons.elem2_pointer.y + dy * cons.elem2_pointer.radius
    );
    ctx.strokeStyle = color;
    ctx.stroke();
  };
}

function canvas_arrow(
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number
) {
  var headlen = 7; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}

export { LineContraint, renderEdges };
