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
  let filter_modal;
  let filter;
  let search_index = 0;

  let current = 0;
  let selectedColor = "LightGreen";
  let search_input;
  let tree = [];

  let hi;
  let height_bar = 66;

  let dateformat = (d, f) => mainObj.dateformat(d, f);

  //height table
  if (!hih && id) {
    hi = document.documentElement.clientHeight - height_bar;
    openMap.get(id).resize = () => {
      hi = document.documentElement.clientHeight - height_bar;
    };
  } else hi = hih;

  //active search and menu
  if (id)
    openMap.get(id).activate = () => {
      if (setTitle) setTitle(Descr, search_input);
    };

  //=====================================update tab=============================/
  let updateTab = async (mode) => {
    /*
    let url = `/FinderStart${IdDeclare}.json`;
    const response = await fetch(url);
    */

    let url = mainObj.baseUrl + "React/FinderStart";
    let bd = new FormData();
    let title;
    if (mode == "new" && id) {
      //check start parametrs
      mid = openMap.get(id);
      if (mid.SQLParams) bd.append("SQLParams", JSON.stringify(mid.SQLParams));
      if (mid.TextParams)
        bd.append("TextParams", JSON.stringify(mid.TextParams));
      title = mid.title;
    }
    if (mode == "data") {
      bd.append("mode", "data");
      bd.append("page", mid.page.toString());
      //let allcols = mid.Fcols.concat(mid.SearchCols)
      bd.append("Fc", JSON.stringify(mid.Fcols)); //mid.Fcols
      if (mid.SQLParams) bd.append("SQLParams", JSON.stringify(mid.SQLParams));
      if (mid.TextParams)
        bd.append("TextParams", JSON.stringify(mid.TextParams));
    }
    bd.append("id", IdDeclare);
    const response = await fetch(url, {
      method: "POST",
      body: bd,
    });
    current = 0;
    const data = await response.json();
    if (data.Error) {
      mainObj.alert("Error:", data.Error);
      return;
    }

    if (mode == "new") {
      //первоначальная загрузка
      mid = data;
      //search index
      mid.Fcols.map((column, index) => {
        if (column.FieldName == mid.DispField) search_index = index;
      });
      Descr = mid.Descr;
      if (title) Descr = Descr + " (" + title + ")";
      load = false;
      if (setTitle) setTitle(Descr, search_input);
    } else {
      mid.MainTab = data.MainTab;
    }
  };
  //=====================================update tab=============================/

  //click on row table
  let handleClick = (i) => {
    if (i == current) {
      //mainObj.message('a-a-a');
      return;
    }

    let maxr = mid.MainTab.length;
    if (i < 0) i = 0;
    if (i >= maxr) i = maxr - 1;
    current = i;
  };

  /*
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
  */
  //document.body.addEventListener('keydown', enterKeyDown, false);

  //===============================delete row======================================/
  let confirmDelete = function () {
    if (current == null) return;
    let rw = mid.MainTab[current];
    let val = rw[mid.DispField];
    if (val == null) val = "Delete row?";
    else val = "Delete row '" + val + "'?";

    mainObj.confirm(Descr, val, rowDelete);
  };
  let rowDelete = async () => {
    let SQLParams = {};
    SQLParams[mid.KeyF] = mid.MainTab[current][mid.KeyF];
    if (mid.DelProc.toLowerCase().indexOf("_del_1") > -1) {
      SQLParams["AUDTUSER"] = mid.Account;
    }

    const url = mainObj.baseUrl + "React/exec";
    let bd = new FormData();

    bd.append("EditProc", mid.DelProc);
    bd.append("SQLParams", JSON.stringify(SQLParams));
    bd.append("KeyF", mid.KeyF);
    bd.append("IdDeclare", IdDeclare);
    bd.append("mode", "delete");

    const response = await fetch(url, {
      method: "POST",
      body: bd,
    });

    const res = await response.json();
    if (res.message != "OK" && res.message != "Invalid storage type: DBNull.") {
      mainObj.alert("Error:", res.message);
      return;
    }
    updateTab("data");
    //mid.MainTab.splice(mid.current, 1);
    //mid = mid
    //this.nupdate = this.nupdate + 1;
    //Сигнал в слоты 22/05/2022
    /*
      if (openMap.get(this.id).updateTab != null)
        openMap.get(this.id).updateTab()

      //Обновляем все гриды в приложении 31.07.2022
      mainObj.extupdate(mid.TableName, this.id);  	    
      */
  };
  //===============================delete row======================================/

  let getIcon = function (column) {
    if (column.Sort == "ASC") return "bi bi-sort-alpha-down";

    if (column.Sort == "DESC") return "bi bi-sort-alpha-up-alt";

    return "bi bi-arrow-down-up";
  };
  let sortChangeIndex = function (column, index) {
    if (column.Sort == "ASC") column.Sort = "DESC";
    else if (column.Sort == "DESC") column.Sort = "Нет";
    else column.Sort = "ASC";

    //this.sortChange (null, index)
    let rang = 0;
    let columns = mid.Fcols;
    columns.map((e, i) => {
      if (e.Sort == "Нет") e.SortOrder = null;

      if (i != index && e.SortOrder) if (e.SortOrder > rang) rang = e.SortOrder;
    });
    columns[index].SortOrder = rang + 1;
    mid.Fcols = mid.Fcols;
  };

  onMount(() => {
    updateTab("new");
    filter_modal = new bootstrap.Modal(filter, {
      keyboard: true,
    });
    //setTitle(Descr, search_input);
    //grid = document.body//document.getElementById('bodytab')
    //grid.addEventListener('keydown',(e) => {enterKeyDown(e)})
  });
  let csv = function () {
    const url = mainObj.baseUrl + "React/csv";
    let bd = new FormData();
    bd.append("id", IdDeclare);
    bd.append("Fc", JSON.stringify(mid.Fcols));
    if (mid.SQLParams) bd.append("SQLParams", JSON.stringify(mid.SQLParams));
    if (mid.TextParams) bd.append("TextParams", JSON.stringify(mid.TextParams));

    fetch(url, {
      method: "POST",
      body: bd,
    })
      .then((res) => res.blob())
      .then((blob) => {
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.setAttribute("download", "data.csv");
        a.click();
      });
  };

  let openDetail = function () {
    if (current == null) return;
    let rw = mid.MainTab[current];
    let val;
    let par;
    let TextParams = {};
    val = rw[mid.KeyF];
    TextParams[mid.KeyF] = val;
    let params = mid.KeyValue;
    let title = rw[mid.DispField];
    let newid = id + "_" + rw[mid.KeyF];
    mainObj.open(newid, "Bureau.Finder", params, true, TextParams, null, title);
  };
</script>

<!----------------------Filter Modal ----------------------------->
<div
  class="modal"
  bind:this={filter}
  tabindex="-1"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          Filter and Sort ({Descr})
        </h1>
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            on:click={() => updateTab("data")}>Update</button
          >
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
            >Cancel</button
          >
        </div>
      </div>
      <div class="modal-body">
        {#if !load}
          {#each mid.Fcols as column, index}
            <div class="input-group mb-3">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  id={column.FieldName}
                  bind:value={column.FindString}
                />
                <label for={column.FieldName}>{column.FieldCaption}</label>
              </div>
              <button
                type="button"
                class="btn btn-secondary input-group-text"
                on:click={() => sortChangeIndex(column, index)}
              >
                <i class={getIcon(column)} />
              </button>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</div>
<!----------------------Filter Modal --------------------------------->

<!--------------------------Search and menu--------------------------->
<div hidden>
  <ul class="navbar-nav" bind:this={search_input}>
    {#if !load}
      <ul class="navbar-nav">
        <input
          bind:value={mid.Fcols[search_index].FindString}
          type="search"
          class="form-control"
          placeholder="Search..."
          aria-label="Search"
          on:input={() => updateTab("data")}
        />
      </ul>
      <ul class="navbar-nav">
        <span class="btn-group">
          <button
            type="button"
            class="btn btn-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-menu-app" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            {#if mid.DelProc}
              <li><button class="dropdown-item" type="button">Add</button></li>
            {/if}

            {#if mid.EditProc}
              <li><button class="dropdown-item" type="button">Edit</button></li>
            {/if}

            {#if mid.DelProc}
              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  on:click={confirmDelete}>Delete</button
                >
              </li>
            {/if}
            <li>
              <button
                class="dropdown-item"
                type="button"
                on:click={() => filter_modal.show()}>Filter and sort</button
              >
            </li>
            <li><button class="dropdown-item" type="button">Pages</button></li>
            <li>
              <button
                class="dropdown-item"
                type="button"
                on:click={() => updateTab("data")}>Refresh</button
              >
            </li>
            <li>
              <button class="dropdown-item" type="button" on:click={csv}
                >Save as CSV</button
              >
            </li>
            {#if mid.KeyValue}
              <li>
                <button
                  class="dropdown-item"
                  type="button"
                  on:click={openDetail}>Detail</button
                >
              </li>
            {/if}
            {#if mid.IdDeclareSet}
              <li>
                <button class="dropdown-item" type="button">Settings</button>
              </li>
            {/if}
          </ul>
        </span>
      </ul>
    {/if}
  </ul>
</div>
<!--------------------------Search and menu--------------------------->

<!--Body an Table-->
<div class="overflow-auto" style="height:{hi}px">
  {#if !load}
    <table class="table table-sm" style="margin:0px">
      <thead>
        <tr style="position: sticky;top: 0px" class="bg-info">
          {#each mid.Fcols as column}
            {#if column.DisplayFormat != "text" && column.DisplayFormat != "hide" && column.DisplayFormat != "password"}
              <th scope="col">{column.FieldCaption}</th>
            {/if}
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
              {#if column.DisplayFormat != "text" && column.DisplayFormat != "hide" && column.DisplayFormat != "password"}
                <td>
                  {dateformat(row[column.FieldName], column.DisplayFormat)}
                </td>
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
