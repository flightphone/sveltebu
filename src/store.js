import { writable } from 'svelte/store';

let openMap = new Map();
let mainObj = {
  resize: function () {
    openMap.forEach((value) => {
      if (value.resize) {
        value.resize()
      }
    });
  }
}

const prodaction = false;
mainObj.baseUrl = (prodaction) ? '' : 'https://demovue.iefimmanievich.repl.co/'

//размеры окон 24/05/2022
window.addEventListener('resize', function () {
  if (mainObj.resize)
    mainObj.resize()
}, true);


export { mainObj, openMap }