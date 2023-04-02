<script>
  //https://bootstrap-4.ru/docs/5.3/components/buttons/
  //https://www.bootstrapdash.com/bootstrap-free-admin-templates
  import { onMount } from "svelte";
  import Bar from "./Bar.svelte";
  import Mymap from "./Mymap.svelte";
  import Finder from "./Finder.svelte";
  import { mainObj, openMap } from "../store.js";

  let currentActive = "124";
  let userNav;
  let openIDs = [];
  let DescrMessage = 'Query';
  

  let myModal;
  //var modalid = 'staticBackdrop';
  let staticBackdrop;
  let msgtext;

  //set nav bsr
  let setTitle = (txt, user_con) => {
    mainObj.setTitle(txt, user_con);
  };

  
  let setTitleMessage = (txt, user_con) => {
    DescrMessage = txt;
    userNav.innerHTML = "";
    if (user_con) userNav.appendChild(user_con);
  };

  let getForm = (id, link1, params) => {
    let control = id != 2 ? Finder : Mymap;
    let SQLParams = null;
    return {
      Conrol: control,
      Params: params,
      SQLParams: SQLParams,
    };
  };

  mainObj.open = (id, link1, params, cash = true) => {
    if (!openMap.get(id)) {
      let c = getForm(id, link1, params);
      let obj = {
        Control: c.Conrol,
        Params: c.Params,
        SQLParams: c.SQLParams,
        data: {},
      };
      openMap.set(id, obj);
      if (cash)
        openIDs.push(id);
    } else if (openMap.get(id).activate) openMap.get(id).activate();

    currentActive = id;
    mainObj.current = id;
    openIDs = openIDs;
    //25.05.2022 история по якорям
    window.location.hash = id;
  };

  mainObj.open(currentActive, "", "132");

  //история переходов
  window.addEventListener(
    "popstate",
    function () {
      let hi = window.location.hash.replace("#", "");
      if (hi != mainObj.current && openMap.get(hi)) {
        /*
        if (openMap.get(hi).activate) openMap.get(hi).activate();
        currentActive = hi;
        mainObj.current = hi;
        openIDs = openIDs;
        */
       
        mainObj.open(hi);
      }
    },
    false
  );

  

  onMount(() => {
    /*
		myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
                  keyboard: false});
    */
    myModal = new bootstrap.Modal(staticBackdrop, {
      keyboard: true,
    });
    mainObj.message = (msg) => {
      msgtext = msg
      myModal.show();
    };
  });
</script>

<!-- Модальное окно bind:this={modalid} -->
<!--id = 'staticBackdrop'-->
<div
  bind:this={staticBackdrop}
  class="modal"
  data-bs-backdrop="static"
  data-bs-keyboard="false"
  tabindex="-1"
  aria-labelledby="staticBackdropLabel"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">
          {DescrMessage}
        </h1>
        <!--
        <form
          class="col-6 col-lg-auto mb-1 mb-lg-2 me-lg-1"
          bind:this={userNav}
        />
        -->
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Закрыть"
        />
      </div>
      <!--
      <div class="modal-body">
        <Finder IdDeclare="132" hih="300" setTitle={setTitleMessage} />
      </div>
      -->
      <div class="modal-body">
        {msgtext}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
          >Ok</button
        >
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
          >Cancel</button
        >
      </div>
    </div>
  </div>
</div>

<Bar />
<div class="container-fluid" style="padding-top:65px;">
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
  <!--
  {#if currentActive == 124}
    <Finder IdDeclare="132" {setTitle} />
  {/if}
  
  {#if currentActive == 122}
    <Finder IdDeclare="130" />
  {/if}
  {#if currentActive == 123}
    <Finder IdDeclare="131" />
  {/if}
  {#if currentActive == 19}
    <Finder IdDeclare="120" />
  {/if}
  {#if currentActive == 32}
    <Finder IdDeclare="121" />
  {/if}
  -->
</div>
