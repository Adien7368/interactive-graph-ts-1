interface Elem {
  pinned: boolean;
  render(ctx: CanvasRenderingContext2D): void;
  update(width: number, height: number): void;
}
