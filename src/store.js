import { navigate } from "svelte-routing";
const prodaction = true;
//const back_url = 'https://demovue.iefimmanievich.repl.co/'
const back_url = 'http://127.0.0.1:5000/'
let openMap = new Map();
let mainObj = {
  login: function () {
    navigate('/login');
  },
  logout: async function () {
    try {
      let url = mainObj.baseUrl + "Home/logout";
      const response = await fetch(url, {
        method: "GET",
        cache: "no-cache",
        credentials: "include",
      });
      navigate('/login')
    } catch (error) { }
    navigate('/login')
  },
  baseUrl: ((prodaction) ? '' : back_url),
  height_bar: 58,
  resize: function () {
    openMap.forEach((value) => {
      if (value.resize) {
        value.resize()
      }
    });
  },
  dateformat: function (d, f) {
    if (d == null)
      return ""
    //if (!d) return d;
    if (f == "text" || f == "hide" || f == 'password' || f == 'disabled' || f == null || f == "")
      return d;

    if (d.length != 24) {
      let res = f.match(/0\.(0+)/);

      let n = 0;
      if (res)
        if (res.length > 1) {
          n = res[1].length;
        }

      if (n > 0) return Number(d.toString()).toFixed(n);
      else return d;
    }
    else {
      try {
        f = f.replace("yyyy", d.substr(0, 4));
        f = f.replace("yy", d.substr(2, 2));
        f = f.replace("MM", d.substr(5, 2));
        f = f.replace("dd", d.substr(8, 2));
        f = f.replace("HH", d.substr(11, 2));
        f = f.replace("mm", d.substr(14, 2));
      } catch (error) {
        f = error.toString()
        // Expected output: ReferenceError: nonExistentFunction is not defined
        // (Note: the exact output may be browser-dependent)
      }
    }

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