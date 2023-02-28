import { Filter, generateWorldFromJSON } from './ToWorld/jsonToWorld';

function getFilter(): Filter {
  let whitelist = document.getElementById('whitelist');
  let blacklist = document.getElementById('blacklist');
  if (
    whitelist instanceof HTMLInputElement &&
    blacklist instanceof HTMLInputElement &&
    (whitelist.checked || blacklist.checked)
  ) {
    let filterContent = (<HTMLInputElement>document.getElementById('list'))
      .value;
    let list: Array<string> | RegExp = [];
    try {
      list = JSON.parse(filterContent);
      if (!(list instanceof Array)) throw new Error('list is not Array');
    } catch (e) {
      console.error(e);
      list = new RegExp(filterContent);
    }

    if (whitelist.checked) {
      return { mode: 'whitelist', list };
    } else {
      return { mode: 'blacklist', list };
    }
  } else {
    return { mode: 'whitelist', list: [] };
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
    alert('Error, check console');
    console.error(e);
  }
}
export { generateWorldFromJSON, run };
