<script>
  //https://bootstrap-4.ru/docs/5.3/components/buttons/
  //https://www.bootstrapdash.com/bootstrap-free-admin-templates
  import { onMount } from "svelte";
  import Bar from "./Bar.svelte";
  import Mymap from "./Mymap.svelte";
  import Finder from "./Finder.svelte";
  import { mainObj } from "../store.js";

  let currentActive = 124;
  let userNav;
  mainObj.current = currentActive;

  //set nav bsr
  let setTitle = (txt, user_con) => {
    mainObj.setTitle(txt, user_con);
  };
  let DescrMessage;
  let setTitleMessage = (txt, user_con) => {
    DescrMessage = txt;
    userNav.innerHTML = "";
    if (user_con) userNav.appendChild(user_con);
  };

  var myModal;
  //var modalid = 'staticBackdrop';
  let staticBackdrop;
  onMount(() => {
    /*
		myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'), {
                  keyboard: false});
    */
    myModal = new bootstrap.Modal(staticBackdrop, {
      keyboard: true,
    });
    mainObj.message = (msg) => {
      myModal.show(msg);
    };

    mainObj.open = (id, link1, params) => {
      /*
      if (link1 == 'Bureau.Finder')
        Control = Finder
      if (link1 == 'Map')  
        Control = Mymap
      IdDeclare = params  
      */
      currentActive = id;
      mainObj.current = currentActive;
      //25.05.2022 история по якорям
      window.location.hash = currentActive;
    };
    //история переходов
    window.addEventListener(
      "popstate",
      function () {
        let hi = window.location.hash.replace("#", "");
        if (hi != mainObj.current) {
          mainObj.current = hi;
          currentActive = hi;
        }
      },
      false
    );
    window.location.hash = currentActive;
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
        <form
          class="col-6 col-lg-auto mb-1 mb-lg-2 me-lg-1"
          bind:this={userNav}
        />
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Закрыть"
        />
      </div>
      <div class="modal-body">
        <Finder IdDeclare="132" hih="300" setTitle={setTitleMessage} />
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

  <!--
<div class="container-fluid" hidden={currentActive!=1}>
<Hdrs/>
</div>
<div class="container-fluid" hidden={currentActive!=2}>
<Mymap/>
</div>
-->

  {#if currentActive == 2}
    <Mymap {setTitle} />
  {/if}

  {#if currentActive == 124}
    <Finder IdDeclare="132" {setTitle} />
  {/if}
  {#if currentActive == 121}
    <Finder IdDeclare="129" />
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
</div>
