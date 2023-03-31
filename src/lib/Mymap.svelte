<main>

<div id="map" class="container-fluid" style="height:{hi}px; margin-top:5px"></div> 

</main>
<script>
import '../../node_modules/leaflet/dist/leaflet.css'
import '../../node_modules/leaflet/dist/leaflet.js'
import { mainObj } from '../store.js';
import { onMount } from 'svelte';

mainObj.resize = ()=>{
	show();
}

export let setTitle

let hi = document.documentElement.clientHeight - 80;
let show = function()
{
	hi = document.documentElement.clientHeight - 80
  const map = L.map('map').setView([51.505, -0.09], 12);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
}


onMount(() => {
		show()
		setTitle('London map')
	});
	
</script>