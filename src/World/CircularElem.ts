import { Elem } from '../World/Elem';

function distance_sq(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) {
  let dx = p1.x - p2.x;
  let dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

class CircularElem implements Elem {
  mousePinned: boolean = false;
  constructor(
    public x: number,
    public y: number,
    public oldx: number,
    public oldy: number,
    public pinned: boolean,
    public radius: number,
    public renderOverride: (
      ctx: CanvasRenderingContext2D,
      e: CircularElem
    ) => void,
    public friction: number = 0.99
  ) {}

  isCoOrdinateInside(x: number, y: number) {
    let dis = distance_sq(this, { x, y });

    return dis < 2 * this.radius * this.radius;
  }

  mouseDown(mouseX: number, mouseY: number) {
    if (this.isCoOrdinateInside(mouseX, mouseY)) {
      this.mousePinned = true;
    }
  }

  mouseMove(mouseX: number, mouseY: number) {
    if (this.mousePinned) {
      this.x = this.oldx = mouseX;
      this.y = this.oldy = mouseY;
    }
  }

  mouseUp() {
    this.mousePinned = false;
  }

  update(width: number, height: number): void {
    if (this.pinned || this.mousePinned) return;
    let dx = this.x - this.oldx;
    let dy = this.y - this.oldy;
    this.oldx = this.x;
    this.oldy = this.y;
    this.x += this.friction * Math.min(dx, 20.0);
    this.y += this.friction * Math.min(dy, 20.0);
    this.constraintNodes(width, height);
    this.contriantSpeed();
  }

  constraintNodes(width: number, height: number) {
    let dx = this.x - this.oldx;
    let dy = this.y - this.oldy;
    if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.oldx = this.x + dx;
    }

    if (this.x < this.radius) {
      this.x = this.radius;
      this.oldx = this.x + dx;
    }

    if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.oldy = this.y + dy;
    }

    if (this.y < this.radius) {
      this.y = this.radius;
      this.oldy = this.y + dy;
    }
  }

  contriantSpeed() {
    if (Math.abs(this.x - this.oldx) > 30) {
      this.oldx = 30 - this.x + this.oldx;
    }
    if (Math.abs(this.y - this.oldy) > 30) {
      this.oldy = 30 - this.y + this.oldy;
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    this.renderOverride(ctx, this);
  }
}
function renderCircularElem(
  strokeWidth: number,
  color: string,
  stroke: string,
  name: string
) {
  return function (ctx: CanvasRenderingContext2D, elem: CircularElem) {
    ctx.beginPath();
    ctx.lineWidth = strokeWidth;
    ctx.arc(elem.x, elem.y, elem.radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.lineWidth = 1;

    ctx.fillStyle = stroke;
    // if (this.showInfo || this.parmanentShowInfo) {
    ctx.font = '16px Arial';
    ctx.fillText(name, elem.x - elem.radius / 2, elem.y - 2 * elem.radius);
    // }
    ctx.fillStyle = 'black';
  };
}

export { CircularElem, renderCircularElem };
