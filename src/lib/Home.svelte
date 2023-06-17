<script>
  //import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Offcanvas, Popover, ScrollSpy, Tab, Toast, Tooltip} from '../../node_modules/bootstrap/dist/js/bootstrap.esm.min.js'
  import { Modal } from "../../node_modules/bootstrap/dist/js/bootstrap.esm.min.js";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  import Bar from "./Bar.svelte";
  import Mymap from "./Mymap.svelte";
  import Finder from "./Finder.svelte";
  import { mainObj, openMap } from "../store.js";

  let currentActive;
  let userNav;
  let openIDs = [];
  let DescrMessage = "Query";

  let myModal;
  //var modalid = 'staticBackdrop';
  let staticBackdrop;
  let msgtext;

  //set nav bsr
  let setTitle = (txt, user_con) => {
    mainObj.setTitle(txt, user_con);
  };

  let getForm = (id, link1, params) => {
    let control = id != 2 ? Finder : Mymap;
    let SQLParams = null;
    return {
      Conrol: control,
      Params: params,
    };
  };

  mainObj.open = (
    id,
    link1,
    params,
    cash = true,
    TextParams = null,
    SQLParams = null,
    title = null
  ) => {
    if (link1 == "exit") {
      mainObj.logout();
      return;
    }

    if (!openMap.get(id)) {
      let c = getForm(id, link1, params);
      let obj = {
        Control: c.Conrol,
        Params: c.Params,
        SQLParams: SQLParams,
        TextParams: TextParams,
        title: title,
        data: {},
      };
      openMap.set(id, obj);
      if (cash) openIDs.push(id);
    } else if (openMap.get(id).activate) openMap.get(id).activate();

    currentActive = id;
    mainObj.current = id;
    openIDs = openIDs;
    //25.05.2022 история по якорям
    window.location.hash = id;
  };

  //история переходов
  window.addEventListener(
    "popstate",
    function () {
      let hi = window.location.hash.replace("#", "");
      if (hi != mainObj.current && openMap.get(hi)) {
        mainObj.open(hi);
      }
    },
    false
  );

  let alertConfirm;
  let alertTitle;
  let alertText;
  let confirmAction;

  mainObj.confirm = function (title, text, action) {
    alertConfirm = true;
    alertTitle = title;
    alertText = text;
    confirmAction = action;
    myModal.show();
  };
  mainObj.alert = function (title, text) {
    alertConfirm = false;
    alertTitle = title;
    alertText = text;
    confirmAction = () => {};
    myModal.show();
  };

  onMount(() => {
    myModal = new Modal(staticBackdrop, {
      keyboard: true,
    });
  });
</script>
<!------------------------Overleaf call--------------------------------------->
<form
  action="https://www.overleaf.com/docs"
  method="post"
  target="_blank"
  style="display:none"
  id = "overleaf"
>
  <input type="text" name="engine" value="xelatex" />
  <textarea name="snip" id = "texdata" />
</form>
<!------------------------Overleaf call--------------------------------------->

<!----------------- message window ------------>
<div
  bind:this={staticBackdrop}
  class="modal"
  data-bs-backdrop="static"
  data-bs-keyboard="false"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">
          {alertTitle}
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <div class="modal-body">
        {alertText}
      </div>
      <div class="modal-footer">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            on:click={confirmAction}>Ok</button
          >
          {#if alertConfirm}
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal">Cancel</button
            >
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<Bar />
<div class="container-fluid" style="padding-top:{mainObj.height_bar}px;padding-left:0px; padding-right:0px">
  <!--<svelte:component this={Control} IdDeclare = {IdDeclare}/>-->
  <!--<Finder IdDeclare = {IdDeclare}/>-->

  {#each openIDs as e}
    <div hidden={e != currentActive}>
      <svelte:component
        this={openMap.get(e).Control}
        IdDeclare={openMap.get(e).Params}
        {setTitle}
        id={e.toString()}
      />
    </div>
  {/each}

  {#if currentActive == "2"}
    <Mymap id="2" {setTitle} />
  {/if}
  <!--
  {#if currentActive == "121"}
    <Finder id="121" IdDeclare="129" setTitle={setTitle}/>
  {/if}
  -->
</div>
