<script>
import { onMount } from 'svelte';
import { mainObj } from '../store.js';

let load = true
let mid = {}
let Descr = 'loading...'

let hi = document.documentElement.clientHeight - 66
mainObj.resize = ()=>{
	hi = document.documentElement.clientHeight - 66
}

let current = 0
let selectedColor = 'LightGreen'
let grid 

let updateTab = async () => {
  let url = '/FinderStart132.json';
  const response = await fetch(url);
  const data = await response.json();
  Descr = data.Descr;
  mid = data;
  load = false;
  grid = document.body//document.getElementById('bodytab')
  //alert(grid)
  //document.body.addEventListener('keydown',(e) => {enterKeyDown(e)})
  grid.addEventListener('keydown',(e) => {enterKeyDown(e)})
}
onMount(updateTab);

let handleClick = (i) =>
{
  if (i == current)
  {
    mainObj.message()
    return
  }
  
  let maxr = mid.MainTab.length
  if (i < 0)
    i = 0
  if (i >= maxr)
    i = maxr-1
  current = i
}

let enterKeyDown = (event) =>
    {
        
        if (event.code == "ArrowDown")
          {
              handleClick(current + 2);
          }
          if (event.code == "ArrowUp")
          {
              handleClick(current - 1);
          }
          if (event.code == "PageDown")
          {
              handleClick(current + 15);
          }
          if (event.code == "PageUp")
          {
              handleClick(current - 15);
          }
          if (event.code == "Home")
          {
              handleClick(0);
          }
          if (event.code == "End")
          {
              handleClick(mid.MainTab.length-1);
          }
    }
  //document.body.addEventListener('keydown', enterKeyDown, false);  
</script>
<div class="overflow-auto" style="height:{hi}px">
{#if !load}
<table class="table table-sm" style="margin:0px">
  <thead>
    <tr style="position: sticky;top: 0px" class="bg-info">
      {#each mid.Fcols as column}
        <th scope="col">{column.FieldCaption}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each mid.MainTab as row, index}
    <tr style="background-color:{(index==current)?selectedColor:'white'}" on:click = {()=>{handleClick(index)}}>
      <!--<th scope="row">1</th>-->
      {#each mid.Fcols as column}
      <td>{row[column.FieldName]}</td>
      {/each}
    </tr>
    {/each}
    
    
  </tbody>
</table>
{/if}
</div>


