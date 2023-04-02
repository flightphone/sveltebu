<script>
  import { onMount } from "svelte";
  import { mainObj, openMap } from "../store.js";
  export let IdDeclare;
  export let setTitle;
  export let hih;
  export let id;

  let load = true;
  let mid = {};
  let Descr = "loading...";
  let findval;

  let hi;
  if (!hih) {
    hi = document.documentElement.clientHeight - 66;
    openMap.get(id).resize = () => {
      hi = document.documentElement.clientHeight - 66;
    };
  } else hi = hih;

  let current = 0;
  let selectedColor = "LightGreen";
  let search_input;

  if (id)
    openMap.get(id).activate = () => {
      if (setTitle) setTitle(Descr, search_input);
    };

  let updateTab = async (mode) => {
    /*
    let url = `/FinderStart${IdDeclare}.json`;
    const response = await fetch(url);
    */

    let url = mainObj.baseUrl + "React/FinderStart";
    let bd = new FormData();
    if (mode == 'data')
    {
      bd.append("mode", "data");
      bd.append("page", mid.page.toString());
      let allcols = mid.Fcols.concat(mid.SearchCols)
      bd.append("Fc", JSON.stringify(allcols)); //mid.Fcols
      if (mid.SQLParams) 
        bd.append("SQLParams", JSON.stringify(mid.SQLParams));
      if (mid.TextParams)
        bd.append("TextParams", JSON.stringify(mid.TextParams));
    }
    bd.append("id", IdDeclare);
    const response = await fetch(url, {
      method: "POST",
      body: bd,
    });
    current = 0
    const data = await response.json();
    mid = data;
    if (mode == 'new') //первоначальная загрузка
    {
      Descr = mid.Descr;
      load = false;
      if (setTitle) setTitle(Descr, search_input);
    }
    
    
  };

  onMount(() => {
    updateTab('new');
    //setTitle(Descr, search_input);
    //grid = document.body//document.getElementById('bodytab')
    //grid.addEventListener('keydown',(e) => {enterKeyDown(e)})
  });

  let handleClick = (i) => {
    if (i == current) {
      mainObj.message();
      return;
    }

    let maxr = mid.MainTab.length;
    if (i < 0) i = 0;
    if (i >= maxr) i = maxr - 1;
    current = i;
  };

  let enterKeyDown = (event) => {
    if (event.code == "ArrowDown") {
      handleClick(current + 2);
    }
    if (event.code == "ArrowUp") {
      handleClick(current - 1);
    }
    if (event.code == "PageDown") {
      handleClick(current + 15);
    }
    if (event.code == "PageUp") {
      handleClick(current - 15);
    }
    if (event.code == "Home") {
      handleClick(0);
    }
    if (event.code == "End") {
      handleClick(mid.MainTab.length - 1);
    }
  };
  //document.body.addEventListener('keydown', enterKeyDown, false);
  let find = (e) => {
    mid.SearchCols[0].FindString = findval;
    updateTab('data')
  };
</script>

<div hidden>
  <input
    bind:this={search_input}
    bind:value={findval}
    type="search"
    class="form-control"
    placeholder="Search..."
    aria-label="Search"
    on:input={find}
  />
</div>
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
          <tr
            style="background-color:{index == current
              ? selectedColor
              : 'white'}"
            on:click={() => {
              handleClick(index);
            }}
          >
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
