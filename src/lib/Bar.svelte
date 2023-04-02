<script>
  import { mainObj } from "../store.js";
  import { navigate } from "svelte-routing";
  import Tree from "./Tree.svelte";
  import { onMount } from "svelte";
  import "./sidebar.css";
  let cnt = 0;
  let Descr = "loading...";
  let userNav;

  let load = true;
  let tree_data = [];

  onMount(async () => {
    let treeurl = mainObj.baseUrl + "ustore/gettree"; //'/gettree.json'
    const resp = await fetch(treeurl);
    tree_data = await resp.json();
    load = false;
  });

  mainObj.setTitle = (title, user_con) => {
    Descr = title;
    userNav.innerHTML = "";
    if (user_con) userNav.appendChild(user_con);
  };

  function open(id, link1, params, cash = true) {
    mainObj.open(id, link1, params, cash);
  }
  function login() {
    navigate("/login");
  }
</script>

<!--Offcanvas-->
<div
  class="offcanvas offcanvas-start"
  tabindex="-1"
  id="offcanvasExample"
  aria-labelledby="offcanvasExampleLabel"
>
  <!--
  <div class="offcanvas-header">
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
  </div>
  -->
  <div class="offcanvas-body">
    <div class="flex-shrink-0 p-3 bg-white" style="width: 280px;">
      {#if !load}
        <Tree items={tree_data} {open} />
      {/if}

      <!----------------------------------------------------------------------------------->

      <!--
      <ul class="btn-toggle-nav list-unstyled fw-normal pb-1">
        <li>
          <a
            href="#"
            class="link-dark rounded"
            data-bs-dismiss="offcanvas"
            on:click={() => open("124", "Bureau.Finder", "132")}>Sales</a
          >
        </li>
        <li>
          <a
            href="#"
            class="link-dark rounded"
            data-bs-dismiss="offcanvas"
            on:click={() => open("121", "Bureau.Finder", "129")}>Stores</a
          >
        </li>
        <li>
          <a
            href="#"
            class="link-dark rounded"
            data-bs-dismiss="offcanvas"
            on:click={() => open("122", "Bureau.Finder", "130")}>Familys</a
          >
        </li>
        <li>
          <a
            href="#"
            class="link-dark rounded"
            data-bs-dismiss="offcanvas"
            on:click={() => open("123", "Bureau.Finder", "131")}>Holidays</a
          >
        </li>
        <li class="mb-1">
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#d19_node"
            aria-expanded="false"
          >
            Settings (Admin)
          </button>
          <div class="collapse" id="d19_node" style="margin-left:15px">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1">
              <li>
                <a
                  href="#"
                  class="link-dark rounded"
                  data-bs-dismiss="offcanvas"
                  on:click={() => open("19", "Bureau.Finder", "120")}>Account</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="link-dark rounded"
                  data-bs-dismiss="offcanvas"
                  on:click={() => open("32", "Bureau.Finder", "121")}>Groups</a
                >
              </li>
            </ul>
          </div>
        </li>
        <li>
          <a
            href="#"
            class="link-dark rounded"
            data-bs-dismiss="offcanvas"
            on:click={() => open("2", "", "", false)}>Map of London</a
          >
        </li>
      </ul>  
      -->

      <div class="dropdown border-top">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1">
          <!--
          <li>
          <a class="link-dark rounded" 
             data-bs-dismiss="offcanvas"
             href="#" 
             on:click={()=>navigate('/login')}
             >Logout</a>
          </li>   
        -->
          <li>
            <a
              href="#"
              class="link-dark rounded"
              data-bs-dismiss="offcanvas"
              on:click={() => open("2", "", "", false)}>Map of London</a
            >
          </li>
        </ul>
      </div>

      <!------------------------------------------------------------>
    </div>
  </div>
</div>

<div class="fixed-top justify-content-lg-start">
  <nav
    class="navbar navbar-expand-lg bg-body-tertiary"
    style="background-color: #e3f2fd"
    data-bs-theme="dark"
  >
    <div class="container-fluid">
      <a
        class="navbar-brand"
        data-bs-toggle="offcanvas"
        href="#offcanvasExample"
        aria-controls="offcanvasExample"
      >
        <i class="bi-list" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="switch navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <span class="fs-4">{Descr}</span>
        </ul>

        <ul
          class="navbar-nav col-6 col-lg-auto mb-1 mb-lg-2 me-lg-1"
          bind:this={userNav}
        />
        <!--class="col-6 col-lg-auto mb-1 mb-lg-2 me-lg-1"-->
      </div>
    </div>
  </nav>
</div>

<style>
  .dropdown-toggle {
    outline: 0;
  }
</style>
