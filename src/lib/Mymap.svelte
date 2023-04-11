<script>
	import "../../node_modules/leaflet/dist/leaflet.css";
	import {map, tileLayer} from "../../node_modules/leaflet/dist/leaflet-src.esm.js";
	import { openMap } from "../store.js";
	import { onMount } from "svelte";

	export let setTitle;
	export let id;
	if (id) {
		openMap.get(id).resize = () => {
			show();
		};
		openMap.get(id).activate = () => {
			if (setTitle) setTitle("London map");
		};
	}

	let hi = document.documentElement.clientHeight - 80;
	let show = function () {
		hi = document.documentElement.clientHeight - 80;
		const mapp = map("map").setView([51.505, -0.09], 12);

		const tiles = tileLayer(
			"https://tile.openstreetmap.org/{z}/{x}/{y}.png",
			{
				maxZoom: 19,
				attribution:
					'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			}
		).addTo(mapp);
	};

	onMount(() => {
		show();
		setTitle("London map");
	});
</script>

<main>
	<div
		id="map"
		class="container-fluid"
		style="height:{hi}px; margin-top:5px"
	/>
</main>
