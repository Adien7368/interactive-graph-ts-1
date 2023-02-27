class CircularElem {
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
  update(width: number, height: number): void {
    if (this.pinned) return;
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
