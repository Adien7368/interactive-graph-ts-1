class WorldGlabalValues {
  public width: number = 0;
  public height: number = 0;
  allElemRepelEachOther: false | number = false;
  constructor(
    public canvas: HTMLCanvasElement,
    repelForce: false | number,
    public friction: number = 0.5
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.allElemRepelEachOther = repelForce;
  }
}

export { WorldGlabalValues };
