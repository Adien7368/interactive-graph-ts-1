import { CircularElem, renderCircularElem } from "../World/CircularElem";
import { Constraint } from "../World/Contraint";
import { LineContraint, renderEdges } from "../World/LineContraint";
import { World } from "../World/World";


type Node = {
  name: string;
  pinned: boolean;
  children: Array<string>;
};

type Filter = {
  mode: 'whitelist', list: Array<string> | RegExp, pinnedList : Array<string> | RegExp
} | {
  mode: 'blacklist', list: Array<string> | RegExp, pinnedList : Array<string> | RegExp
}

function generateWorldFromJSON(json: Object, filter: Filter,repelForce?: number) {
  
  const constraint: Array<Constraint> = [];
  const generatedNode = ConvertObjectToNode(json);
  if(generatedNode instanceof Error) return generatedNode;

  const nodes = filterNodes(generatedNode, filter);
  console.log("Filtered Node",nodes);
  const NodesElem: Map<string,CircularElem> = new Map();
 
  nodes.forEach(node => {
    if(node.pinned) {
    const render = renderCircularElem(1, 'white', 'grey', node.name);
    const elem = new CircularElem(100+(100*Math.random() -50), 100+(100*Math.random()-50), 100 , 100, true, 15, render);
    NodesElem.set(node.name,elem);
  } else {
    const render = renderCircularElem(1, 'grey', 'black', node.name);
    const elem = new CircularElem(100+(100*Math.random() -50), 100+(100*Math.random()-50), 100 , 100, false, 15, render);
    NodesElem.set(node.name,elem);
  }
  });
  
  const elems = [...NodesElem.values()];
  nodes.forEach(node => node.children.forEach(child => {
    const lineRender = renderEdges('black', 1);
    let elem1 = NodesElem.get(node.name);
    let elem2 = NodesElem.get(child);
    if( elem1 && elem2){
      const cons = new LineContraint(elem1,elem2 , 100, 0.001, lineRender);
      constraint.push(cons);
    } 
  })); 
  return (canvas: HTMLCanvasElement) => new World(canvas, elems, constraint, repelForce);
  
}


function ConvertObjectToNode(json: Object) {
  const keys = Object.keys(json);
  const values = Object.values(json);
  const children: Array<Array<string>> = [];
 
  for (let i = 0; i < values.length; ++i) {
    let v = values[i];
    if (v instanceof Array<string>) {
      for(let j=0;j<v.length;++j){
        if(v.at(j) && !keys.find(e => e === v.at(j))){
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
      pinned: false,
      children: children[i]
    };
    result.push(node);
  }

  return result;
}


function checkFilter(str: string,filter: Filter){
  let invert = filter.mode == 'whitelist'? true:false;
  if(filter.list instanceof Array){
      let ans = filter.list.find(e => e == str)?true:false;
      return invert? ans: !ans;
    } else {
      let ans = filter.list.test(str);
      return invert ? ans : !ans;
    }
   
}

function filterNodes(nodes: Array<Node>,filter : Filter): Array<Node> {
  nodes = nodes.filter(node => checkFilter(node.name, filter));
  const filteredNode = nodes.map(node => {
    let newChild = node.children.filter(child => nodes.find(n => n.name == child));
    let pinned = false;
    if(filter.pinnedList instanceof Array)
      pinned = filter.pinnedList.find(e => e === node.name)?true:false;
    else
      pinned = filter.pinnedList.test(node.name);
    return {name: node.name, pinned, children: newChild};
  });
  return filteredNode;
}


export { generateWorldFromJSON, ConvertObjectToNode , type Filter};
