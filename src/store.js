import { writable } from 'svelte/store';
const prodaction = false;
let openMap = new Map();
let mainObj = {
  //baseUrl:  ((prodaction) ? '' : 'https://demovue.iefimmanievich.repl.co/'),
  baseUrl:  ((prodaction) ? '' : 'http://127.0.0.1:5000/'),
  resize: function () {
    openMap.forEach((value) => {
      if (value.resize) {
        value.resize()
      }
    });
  },
  dateformat: function (d, f) {
    if (d==null)
      return ""
    //if (!d) return d;
    if (f=="text" || f == "hide" || f == 'password' || f== 'disabled' || f == null || f == "")
      return d;

    if (d.length < 19) {
      let res = f.match(/0\.(0+)/);

      let n = 0;
      if (res)
        if (res.length > 1) {
          n = res[1].length;
        }

      if (n > 0) return Number(d.toString()).toFixed(n);
      else return d;
    }
    f = f.replace("yyyy", d.substr(0, 4));
    f = f.replace("yy", d.substr(2, 2));
    f = f.replace("MM", d.substr(5, 2));
    f = f.replace("dd", d.substr(8, 2));
    f = f.replace("HH", d.substr(11, 2));
    f = f.replace("mm", d.substr(14, 2));
    return f;
  }

}


//mainObj.baseUrl = (prodaction) ? '' : 'https://demovue.iefimmanievich.repl.co/'

//размеры окон 24/05/2022
window.addEventListener('resize', function () {
  if (mainObj.resize)
    mainObj.resize()
}, true);


export { mainObj, openMap }