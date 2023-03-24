import { Filter, generateWorldFromJSON } from './ToWorld/jsonToWorld';

function getFilter(): Filter {
  let whitelist = <HTMLInputElement>document.getElementById('whitelist');
  let blacklist = <HTMLInputElement>document.getElementById('blacklist');
  let nthChild = <HTMLSelectElement>document.getElementById('nthchild');
  let nthParent = <HTMLSelectElement>document.getElementById('nthparent');
  let includeNthChild: number = 0;
  let includeNthParent: number = 0;

  if (whitelist.checked || blacklist.checked) {
    let filterContent = (<HTMLInputElement>(
      document.getElementById('list')
    )).value
      .replace(/'/g, '"')
      .trim();
    let pinnedContent = (<HTMLInputElement>(
      document.getElementById('pinned')
    )).value
      .replace(/'/g, '"')
      .trim();
    let list: Array<string> | RegExp = [];
    let pinnedList: Array<string> | RegExp = [];

    try {
      list = JSON.parse(filterContent);
      if (!(list instanceof Array)) throw new Error('filterlist is not Array');
    } catch (e) {
      console.error(e);
      list = new RegExp(filterContent == '' ? '.*' : filterContent);
    }

    try {
      pinnedList = JSON.parse(pinnedContent);
      if (!(pinnedList instanceof Array))
        throw new Error('pinnedlist is not Array');
    } catch (e) {
      console.error(e);
      pinnedList = new RegExp(pinnedContent == '' ? '\b' : pinnedContent);
    }

    try {
      includeNthChild = parseInt(nthChild.value);
    } catch (e) {
      includeNthChild = 0;
    }

    try {
      includeNthParent = parseInt(nthParent.value);
    } catch (e) {
      includeNthParent = 0;
    }
    return {
      mode: whitelist.checked ? 'whitelist' : 'blacklist',
      list,
      pinnedList,
      includeNthChild,
      includeNthParent,
    };
  } else {
    return {
      mode: 'whitelist',
      list: [],
      pinnedList: [],
      includeNthChild: 0,
      includeNthParent: 0,
    };
  }
}

function run() {
  let elem = <HTMLInputElement>document.getElementById('input');
  let filter = getFilter();

  try {
    let json: Object = JSON.parse(elem.value);

    const fn = generateWorldFromJSON(json, filter, 0.01);
    if (fn instanceof Error) {
      throw fn;
    } else {
      let canvas = document.createElement('canvas');
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      let card = <HTMLElement>document.getElementById('card');
      card.remove();
      document.body.appendChild(canvas);
      const world = fn(canvas);
      world.run();
    }
  } catch (e) {
    if (e instanceof Error) alert('Error, ' + e.message);
    else alert('Error, check console');
    console.error(e);
  }
}
export { generateWorldFromJSON, run };
