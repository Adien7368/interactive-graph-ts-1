import { Elem } from "../World/Elem";

interface Constraint {
  elems: Array<Elem>;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
}
export {type Constraint};