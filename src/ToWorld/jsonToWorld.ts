import { CircularElem, renderCircularElem } from "../World/CircularElem";
import { LineContraint, renderEdges } from "../World/LineContraint";
import { World } from "../World/World";


type Node = {
  name: string;
  children: Array<string>;
};

function ConvertObjectToNode(json: Object) {
  const keys = Object.keys(json);
  const values = Object.values(json);
  const children: Array<Array<string>> = [];
 
  for (let i = 0; i < values.length; ++i) {
    let v = values[i];
    if (v instanceof Array<string>) {
      for(let j=0;j<v.length;++j){
        if(v.at(j) && keys.find(e => e !== v.at(j))){
          return new Error(`One of the child ${v[j]} is not present among keys of json`);
        }
      } 
      children.push(v);
    } else {
      return new Error('Invalid JSON');
    }
  }

  const result = [];
  for(let i=0;i<keys.length;++i){
    const node: Node = {
      name: keys[i],
      children: children[i]
    };
    result.push(node);
  }
  return result;
}

function generateWorldFromJSON(canvas: HTMLCanvasElement,json: Object) {
  
  const constraint: Array<Constraint> = [];
  const nodes = ConvertObjectToNode(json);
  if(nodes instanceof Error) return nodes;
  const NodesElem: Map<string,CircularElem> = new Map();
  nodes.forEach(node => {
    const render = renderCircularElem(1, 'grey', 'black', node.name);
    const elem = new CircularElem(100+50*Math.random(), 100, 50 + 50*Math.random(), 50, false, 10, render);
    NodesElem.set(node.name,elem);
  });
  const elems = [...NodesElem.values()];
  nodes.forEach(node => node.children.forEach(child => {
    const lineRender = renderEdges('black', 1);
    let elem1 = NodesElem.get(node.name);
    let elem2 = NodesElem.get(child);
    if( elem1 && elem2){
      const cons = new LineContraint(elem1,elem2 , 100, 0.5, lineRender);
      constraint.push(cons);
    }
  }));

  const world = new World(canvas,elems,constraint);
  return world;
}

export { generateWorldFromJSON, ConvertObjectToNode };
