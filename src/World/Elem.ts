interface Elem {
  isPinned:() => boolean;
  render(ctx: CanvasRenderingContext2D): void;
  update(width: number, height: number): void;
  applyForce(fx: number, fy: number): void;
  mouseDown(x: number, y: number): void;
  mouseMove(x: number, y: number): void;
  mouseUp(): void;
  distanceFrom?:(x: number,y: number) => number;
}

export { type Elem };
