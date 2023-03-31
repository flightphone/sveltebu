//import './app.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css'

import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
