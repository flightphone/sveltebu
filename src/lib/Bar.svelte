<script>
  import { mainObj } from "../store.js";
  import Tree from "./Tree.svelte";
  import { onMount } from "svelte";
  import "./sidebar.css";

  let Descr = "loading...";
  let userNav;

  let load = true;
  let tree_data = [];

  onMount(async () => {
    try {
      //let treeurl = mainObj.baseUrl + "ustore/gettree"; //'/gettree.json'
      let treeurl = '/json/gettree.json'
      const resp = await fetch(treeurl, {
        cache: "no-cache",
        credentials: "include",
      });
      tree_data = await resp.json();
      let n = tree_data.length;
      for (let i = 0; i < n; i++) {
        if (!tree_data[i].children) {
          let item = tree_data[i];
          open(
            item.id.toString(),
            item.attributes.link1,
            item.attributes.params.toString()
          );
          break;
        }
      }
      load = false;
    } catch (err) {
      mainObj.login();
    }
  });

  mainObj.setTitle = (title, user_con) => {
    Descr = title;
    userNav.innerHTML = "";
    if (user_con) userNav.appendChild(user_con);
  };

  function open(id, link1, params, cash = true) {
    mainObj.open(id, link1, params, cash);
  }
  /*
  function login() {
    navigate("/login");
  }
  */
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
  <div class="offcanvas-body bg-primary" style="padding-top:30px; padding-left:0px; width:auto;">
    <!-- <div class="bg-white"> -->
      {#if !load}
        <Tree items={tree_data} {open} />
      {/if}

      <!----------------------------------------------------------------------------------->
<!--
      <div class="dropdown border-top">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1">
          <li>
            <a
              class="link-dark rounded"
              data-bs-dismiss="offcanvas"
              href="#"
              on:click={mainObj.logout}>Exit</a
            >
          </li>

          <li>
            <a
              href="#"
              class="link-dark rounded"
              data-bs-dismiss="offcanvas"
              on:click={() => open("2", "", "", false)}>Map of London</a
            >
          </li>
          <li>
            <a
              href="https://github.com/flightphone/sveltebu"
              class="link-dark rounded"
              target="_blank">github.com</a
            >
          </li>
        </ul>
      </div>
-->
      <!------------------------------------------------------------>
    <!-- </div> -->
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          class="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
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
          <span class="fs-5">{Descr}</span>
        </ul>
        <!--
        <ul
          class="navbar-nav col-6 col-lg-auto mb-1 mb-lg-2 me-lg-1"
          bind:this={userNav}
        />
        -->
        <div class="navbar-nav" bind:this={userNav} />
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
