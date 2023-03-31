<script>
import { mainObj } from '../store.js';
import { navigate } from 'svelte-routing'
import { link, links } from 'svelte-routing'
//import { onMount } from 'svelte';
import './sidebar.css'
let cnt = 0;
let Descr = 'Table'
mainObj.setTitle = (title) => {Descr = title}

function open(id, link1, params)
{
  mainObj.open(id, link1, params)
}
function login()
{
  navigate('/login')
}

</script>
<!--Offcanvas-->
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <!--
  <div class="offcanvas-header">
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
  </div>
  -->
  <div class="offcanvas-body">
  <div class="flex-shrink-0 p-3 bg-white" style="width: 280px;">
<!----------------------------------------------------------------------------------->

<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
<li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(124, "Bureau.Finder", "132")}>Sales</a></li>
<li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(121, "Bureau.Finder", "129")}>Stores</a></li>
<li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(122, "Bureau.Finder", "130")}>Familys</a></li>
<li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(123, "Bureau.Finder", "131")}>Holidays</a></li>
<li class="mb-1">
            <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#d19_node" aria-expanded="false">
               Settings (Admin)
            </button>
            <div class="collapse" id="d19_node" style="margin-left:15px">
            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1">
<li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(19, "Bureau.Finder", "120")}>Accounts</a></li>
<li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(32, "Bureau.Finder", "121")}>Groups</a></li>
</ul></div>
<li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(2, "Bureau.Finder", "")}>Map of London</a></li>
</ul>


<!----------------------------------------------------------------------------------->
  <!--
    <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
      <li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(1, 'Bureau.Finder', '132')}>Table22</a></li>
      <li class="mb-1">
        <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
          Home
        </button>
        <div class="collapse show" id="home-collapse" style="margin-left:15px">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1">
            <li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(1, 'Bureau.Finder', '132')}>Table</a></li>
            <li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(2, 'Map', '?')}>Map</a></li>
            <li><a href="#" class="link-dark rounded" data-bs-dismiss="offcanvas" on:click = {()=>open(3, 'Bureau.Finder', '131')}>Reports</a></li>
          </ul>
        </div>
      </li>
      
      <li class="mb-1">
        <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
          Dashboard
        </button>
        <div class="collapse" id="dashboard-collapse">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" class="link-dark rounded">Overview</a></li>
            <li><a href="#" class="link-dark rounded">Weekly</a></li>
            <li><a href="#" class="link-dark rounded">Monthly</a></li>
            <li><a href="#" class="link-dark rounded">Annually</a></li>
          </ul>
        </div>
      </li>
      <li class="mb-1">
        <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
          Orders
        </button>
        <div class="collapse" id="orders-collapse">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" class="link-dark rounded">New</a></li>
            <li><a href="#" class="link-dark rounded">Processed</a></li>
            <li><a href="#" class="link-dark rounded">Shipped</a></li>
            <li><a href="#" class="link-dark rounded">Returned</a></li>
          </ul>
        </div>
      </li>
      <li class="border-top my-3"></li>
      <li class="mb-1">
        <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
          Account
        </button>
        <div class="collapse" id="account-collapse">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li><a href="#" class="link-dark rounded">New...</a></li>
            <li><a href="#" class="link-dark rounded">Profile</a></li>
            <li><a href="#" class="link-dark rounded">Settings</a></li>
            <li><a href="#" class="link-dark rounded">Sign out</a></li>
          </ul>
        </div>
      </li>
    </ul>
-->
  </div>

  </div>
</div>



<div class="fixed-top justify-content-lg-start">
<nav class="navbar navbar-expand-lg bg-body-tertiary" style="background-color: #e3f2fd" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" data-bs-toggle="offcanvas" href="#offcanvasExample" aria-controls="offcanvasExample">
    <i class="bi-list"></i>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="switch navigation">
      <span class="navbar-toggler-icon"></span>     
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <span class="fs-4">{Descr}</span>  
      
      
       
      </ul>
      <form class="col-6 col-lg-auto mb-1 mb-lg-2 me-lg-1">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search">
        </form>


      <ul class="navbar-nav dropstart">
      <!-- Avatar  -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" 
          role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
        </a>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" href="#">My profile</a>
          </li>
          <li>
            <a class="dropdown-item" href="#">Settings</a>
          </li>
          <li>
            <a class="dropdown-item" href="/login" use:link>Logout</a>
          </li>
        </ul>
      </li>
    </ul> 

    
      
    </div>
  </div>
</nav>
</div>

<style>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, .1);
  border: solid rgba(0, 0, 0, .15);
  border-width: 1px 0;
  box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 .25rem rgba(255, 255, 255, .25);
}

.bi {
  vertical-align: -.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>