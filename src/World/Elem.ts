interface Elem {
  pinned: boolean;
  render(ctx: CanvasRenderingContext2D): void;
  update(width: number, height: number): void;
  mouseDown(x: number, y: number): void;
  mouseMove(x: number, y: number): void;
  mouseUp(): void;
}

export { type Elem };
