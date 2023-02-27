class WorldGlabalValues {
  public width: number = 0;
  public height: number = 0;
  constructor(public canvas: HTMLCanvasElement, public friction: number = 0.5) {
    this.width = canvas.width;
    this.height = canvas.height;
  }
}

export { WorldGlabalValues };
