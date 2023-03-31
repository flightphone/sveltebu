import { writable } from 'svelte/store';

let mainObj = {}

const prodaction = false;
mainObj.baseUrl = (prodaction) ? '' : 'https://demovue.iefimmanievich.repl.co/'

//размеры окон 24/05/2022
window.addEventListener('resize', function() {
  if (mainObj.resize)
     mainObj.resize()
}, true);


export {mainObj}