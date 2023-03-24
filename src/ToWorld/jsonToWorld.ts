import { CircularElem, renderCircularElem } from "../World/CircularElem";
import { Constraint } from "../World/Contraint";
import { LineContraint, renderEdges } from "../World/LineContraint";
import { World } from "../World/World";
import { boolean, decode, record, string, array, decodeType } from 'typescript-json-decoder';

type Node = decodeType<typeof nodeDecoder>;

const nodeDecoder = record({
  name: string,
  pinned: boolean,
  children: array(string)
})


type Filter = {
  mode: 'whitelist' | 'blacklist', 
  list: Array<string> | RegExp, 
  pinnedList : Array<string> | RegExp, 
  includeNthChild: number,
  includeNthParent: number
} 

function generateWorldFromJSON(json: Object, filter: Filter,repelForce?: number) {
  console.log("Filter : ",filter);
  const constraint: Array<Constraint> = [];
  const generatedNode = ConvertObjectToNode(json, filter.pinnedList);
  if(generatedNode instanceof Error) return generatedNode;

  const nodes = filterNodes(generatedNode, filter);
  console.log("Filtered Node : ",nodes);
  const NodesElem: Map<string,CircularElem> = new Map();
 
  nodes.forEach(node => {
    if(node.pinned) {
    const render = renderCircularElem(1, node.name);
    const elem = new CircularElem(100+(100*Math.random() -50), 100+(100*Math.random()-50), 100 , 100, true, 15, render);
    NodesElem.set(node.name,elem);
  } else {
    const render = renderCircularElem(1, node.name);
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
      const cons = new LineContraint(elem1,elem2 , 100 + 6*node.children.length, 0.001, lineRender);
      constraint.push(cons);
    } 
  })); 
  return (canvas: HTMLCanvasElement) => new World(canvas, elems, constraint, repelForce);
  
}


function ConvertObjectToNode(json: Object, pinnedList: Array<string> | RegExp) {
  return Object.entries(json).map(([key, value]) => {
    let pinned = false;
    if(pinnedList instanceof RegExp) {
      pinned = pinnedList.test(key);
    } else {
      pinned = pinnedList.includes(key);
    }
    return decode(nodeDecoder)({name: key, pinned, children: value})
  })  
}


function getSeedList(allnodes: Array<Node>, filter: Filter): Array <String> {
  let list = filter.list;
  if(list instanceof RegExp) {
    let t = list;// Booring
    return allnodes.filter(n => t.test(n.name)).map(n => n.name);
  } else {
    return list;
  }
}


function filterNodes(allnodes: Array<Node>, filter: Filter): Array<Node>{
  const seedList: Array<String> = getSeedList(allnodes, filter);
  const result: Set<String> = new Set(seedList);
  // Precompute Mapping
  const mapNameToNode: Map<String,Node> = new Map();
  allnodes.forEach(n => mapNameToNode.set(n.name, n));
  const parents: Map<String, Array<Node>> = new Map();
  allnodes.forEach(n => n.children.forEach(c => {
    let val = parents.get(c);
    if(val) {
      parents.set(c, val.concat([n]));
    } else {
      parents.set(c, [n]);
    }
  }));
  console.log("Parents : ", parents);
  // Child Nth Code
  let queue = [...seedList];
  for(let i = 1; i<=filter.includeNthChild;++i){

    let nextChildren: Set<String> = new Set();
    queue.forEach(name => {
      let currentNode = mapNameToNode.get(name);
      if(currentNode){
        currentNode.children.forEach(childName => nextChildren.add(childName));
      }
    });
    
    nextChildren.forEach(n => result.add(n));
    queue = Array.from(nextChildren.values());
  }


  // Parent Nth Code
  let parentqueue: Array<Node> = [];
  if(filter.includeNthParent > 0){
    seedList.forEach(n => {const t = parents.get(n); if(t)parentqueue = parentqueue.concat(t);})
    parentqueue.forEach(p => result.add(p.name));
  }
  for(let i = 2; i <= filter.includeNthParent;++i){
    let nextParents: Set<Node> = new Set();
    parentqueue.forEach(node => {
      const parray = parents.get(node.name);
      if(parray) parray.forEach(node => nextParents.add(node));
    })
    nextParents.forEach(p => result.add(p.name));
    parentqueue = Array.from(nextParents.values());
  }

  return allnodes.filter(n => {
    const res = result.has(n.name) ? true: false;
    if(filter.mode == 'blacklist') return !res;
    else return res;
  });
}




export { generateWorldFromJSON , type Filter};
