<script>
  import { Modal } from "../../node_modules/bootstrap/dist/js/bootstrap.esm.min.js";
  import { onMount } from "svelte";
  import { mainObj, openMap } from "../store.js";
  import Editor from "./Editor.svelte";
  export let IdDeclare;
  export let setTitle;
  export let hih;
  export let id;

  //editors mode
  export let editid;
  export let findData;
  export let selectFinder;

  let load = true;
  let mid = {};
  let Descr = "loading...";
  let findval;
  let filter_modal;
  let filter;
  let search_index = 0;
  let offcanvasTop;
  let offcanvasTop_modal;

  let current = 0;
  let selectedColor = "LightGreen";
  let search_input;
  let tree = [];
  let pages = [];
  let mode_edit = "grid";
  let editDisp = {
    close: () => {
      mode_edit = "grid";
      if (setTitle) setTitle(Descr, search_input);
    },
  };
  let setDisp = {
    close: () => {
      mode_edit = "grid";
      if (setTitle) setTitle(Descr, search_input);
    },
  };
  let hi;
  let height_bar = mainObj.height_bar + 5;

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
      if (setTitle) {
        if (mode_edit == "grid") setTitle(Descr, search_input);
        if (mode_edit == "edit" || mode_edit == "add")
          editDisp.activate(mode_edit);
        if (mode_edit == "setting") setDisp.activate(mode_edit);
      }
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

    if (mode == "data" || (mode == "new" && editid == null)) {
      if (mode == "data") {
        bd.append("mode", "data");
        bd.append("page", mid.page.toString());
        //let allcols = mid.Fcols.concat(mid.SearchCols)
        bd.append("Fc", JSON.stringify(mid.Fcols)); //mid.Fcols
        if (mid.SQLParams)
          bd.append("SQLParams", JSON.stringify(mid.SQLParams));
        if (mid.TextParams)
          bd.append("TextParams", JSON.stringify(mid.TextParams));
      }

      bd.append("id", IdDeclare);
      const response = await fetch(url, {
        method: "POST",
        body: bd,
        cache: "no-cache",
        credentials: "include",
      });

      const data = await response.json();
      if (data.Error) {
        if (setTitle) setTitle(data.Error);
        mainObj.alert("Error:", data.Error);
        return;
      }
      if (mode == "new") mid = data;
      else {
        mid.MainTab = data.MainTab;
        mid.MaxPage = data.MaxPage;
        mid.TotalTab = data.TotalTab;
      }
    }
    if (mode == "new" && editid != null) {
      mid = findData;
    }

    current = 0;
    mid.curRow = 0;
    if (mode == "new") {
      //первоначальная загрузка
      //search index
      mid.Fcols.map((column, index) => {
        if (column.FieldName == mid.DispField) search_index = index;
      });
      Descr = mid.Descr;
      if (title) Descr = Descr + " (" + title + ")";
      load = false;
      if (setTitle) setTitle(Descr, search_input);
    }

    //update pages list
    /*
    let nr = parseInt(mid.TotalTab[0].n_total);
    let md = nr % parseInt(mid.nrows);
    let np = (nr - md) / parseInt(mid.nrows);
    if (md > 0) np = np + 1;
    np = Math.min(np, 12);
    */
    let np = Math.min(10, parseInt(mid.MaxPage));
    pages = [];
    for (let i = 0; i < np; i++) pages.push(i + 1);
    pages = pages;
  };
  //=====================================update tab=============================/

  //click on row table
  let handleClick = (i) => {
    if (i == current) {
      if (mid.EditProc && editid == null) open("edit");
      if (editid != null) selectFinder(editid);
      return;
    }

    let maxr = mid.MainTab.length;
    if (i < 0) i = 0;
    if (i >= maxr) i = maxr - 1;
    current = i;
    mid.curRow = current;
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
      cache: "no-cache",
      credentials: "include",
    });

    const res = await response.json();
    if (res.message != "OK" && res.message != "Invalid storage type: DBNull.") {
      mainObj.alert("Error:", res.message);
      return;
    }
    //updateTab("data");
    mid.MainTab.splice(current, 1);
    mid.MainTab = mid.MainTab;

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

  //=================================sort change=================================
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
  //=================================sort change=================================/

  //==================================on mount===================================
  onMount(() => {
    updateTab("new");

    filter_modal = new Modal(filter, {
      keyboard: true,
    });

    offcanvasTop_modal = new Modal(offcanvasTop, {
      keyboard: true,
    });
  });

  //==================================on mount===================================

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

  let onChangePage = (pg) => {
    mid.page = pg;
    updateTab("data");
  };

  let open = (m) => {
    mode_edit = m;
    mid.curRow = current;

    if (mode_edit == "edit" || mode_edit == "add") {
      editDisp.activate(mode_edit);
      editDisp.open();
    }
    if (mode_edit == "setting") {
      setDisp.activate(mode_edit);
      setDisp.open();
    }
  };
  let save = () => {
    mid.MainTab = mid.MainTab;
  };
  let saveSetting = () => {
    let data = mid.Setting;
    data.ReferEdit.SaveFieldList.map((f) => {
      mid.SQLParams["@" + f] = data.MainTab[0][f];
    });
    updateTab("data");
  };
</script>

<!--------------------Pages------------- aria-labelledby="offcanvasTopLabel" <h5 id="offcanvasTopLabel">Offcanvas top</h5>> -->
<div class="modal modal-lg" tabindex="-1" bind:this={offcanvasTop}>
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        {#if !load}
          <nav aria-label="Page navigation example">
            <ul class="pagination pagination-lg">
              {#each pages as e}
                <li class={e != mid.page ? "page-item" : "page-item active"}>
                  <a class="page-link" href="#" on:click={() => onChangePage(e)}
                    >{e}</a
                  >
                </li>
              {/each}
            </ul>
          </nav>
        {/if}
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
    </div>
  </div>
</div>

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
            class="btn btn-secondary"
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
  <div
    style="display:flex; justify-content:start; align-items:center; gap:10px; margin-right:10px"
    bind:this={search_input}
  >
    {#if !load}
      {#if mid.DelProc && editid == null}
        <button
          type="button"
          class="btn btn-secondary"
          on:click={() => open("add")}>Add</button
        >
      {/if}

      {#if mid.EditProc && editid == null}
        <button
          type="button"
          class="btn btn-secondary"
          on:click={() => open("edit")}>Edit</button
        >
      {/if}

      {#if mid.DelProc && editid == null}
        <button type="button" class="btn btn-secondary" on:click={confirmDelete}
          >Delete</button
        >
      {/if}

      {#if editid == null}
        <button class="btn btn-secondary" type="button" on:click={csv}
          >CSV</button
        >
      {/if}
      {#if mid.KeyValue && editid == null}
        <button class="btn btn-secondary" type="button" on:click={openDetail}
          >Detail</button
        >
      {/if}
      {#if mid.IdDeclareSet && editid == null}
        <button
          class="btn btn-secondary"
          type="button"
          on:click={() => open("setting")}>Settings</button
        >
      {/if}

      <input
        bind:value={mid.Fcols[search_index].FindString}
        type="search"
        class="form-control"
        placeholder="Search..."
        aria-label="Search"
        on:input={() => updateTab("data")}
      />
      <a href="#" on:click={() => filter_modal.show()} title="Filter">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          class="bi bi-funnel"
          viewBox="0 0 16 16"
        >
          <path
            d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"
          />
        </svg>
      </a>

      <a href="#" on:click={() => updateTab("data")} title="Refesh">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-arrow-clockwise"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
          />
          <path
            d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
          />
        </svg>
      </a>

      <!--
      <div class="input-group">
        <button
          type="button"
          class="btn btn-secondary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="bi bi-menu-app" />
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          {#if mid.DelProc && editid == null}
            <li>
              <button
                class="dropdown-item"
                type="button"
                on:click={() => open("add")}>Add</button
              >
            </li>
          {/if}

          {#if mid.EditProc && editid == null}
            <li>
              <button
                class="dropdown-item"
                type="button"
                on:click={() => open("edit")}>Edit</button
              >
            </li>
          {/if}

          {#if mid.DelProc && editid == null}
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
          <li>
            <button
              class="dropdown-item"
              type="button"
              on:click={() => offcanvasTop_modal.show()}>Pages</button
            >
          </li>
          <li>
            <button
              class="dropdown-item"
              type="button"
              on:click={() => updateTab("data")}>Refresh</button
            >
          </li>
          {#if editid == null}
            <li>
              <button class="dropdown-item" type="button" on:click={csv}
                >Save as CSV</button
              >
            </li>
          {/if}
          {#if mid.KeyValue && editid == null}
            <li>
              <button class="dropdown-item" type="button" on:click={openDetail}
                >Detail</button
              >
            </li>
          {/if}
          {#if mid.IdDeclareSet && editid == null}
            <li>
              <button
                class="dropdown-item"
                type="button"
                on:click={() => open("setting")}>Settings</button
              >
            </li>
          {/if}
        </ul>
      </div>
      -->
    {/if}
  </div>
</div>
<!--------------------------Search and menu--------------------------->

<!--Body  Table-->
<div class="overflow-auto" style="height:{hi}px" hidden={mode_edit != "grid"}>
  {#if !load}
    <table class="table table-sm fs-6" style="margin:0px">
      <thead>
        <tr style="position: sticky;top: 0px;" class="bg-primary text-light">
          {#each mid.Fcols as column}
            {#if column.DisplayFormat != "text" && column.DisplayFormat != "hide" && column.DisplayFormat != "password"}
              <th
                scope="col"
                class="align-middle text-center"
                style="font-size: 14px; font-style:normal;height:35px"
                >{column.FieldCaption}</th
              >
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
        {#if pages.length > 1}
          <tr>
            <td colspan="0" style="border: none;">
              <nav>
                <ul class="pagination" style="margin-bottom:0px">
                  {#each pages as e}
                    <li
                      class={e != mid.page ? "page-item" : "page-item active"}
                    >
                      <a
                        class="page-link"
                        href="#"
                        on:click={() => onChangePage(e)}>{e}</a
                      >
                    </li>
                  {/each}
                </ul>
              </nav>
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  {/if}
</div>
<!-----------------------------------Editor------------------------------>
{#if editid == null}
  <div
    class="container-fluid"
    hidden={!(mode_edit == "edit" || mode_edit == "add")}
  >
    {#if !load && mid.EditProc}
      <Editor {setTitle} {editDisp} findData={mid} save_fun={save} />
    {/if}
  </div>

  <div class="container-fluid" hidden={!(mode_edit == "setting")}>
    {#if !load && mid.IdDeclareSet}
      <Editor
        {setTitle}
        editDisp={setDisp}
        findData={mid.Setting}
        save_fun={saveSetting}
      />
    {/if}
  </div>
{/if}

<!-----------------------------------Editor------------------------------>

<style>
  td {
    padding-left: 10px;
  }
  a {
    color: var(--bs-navbar-brand-color);
  }
</style>
