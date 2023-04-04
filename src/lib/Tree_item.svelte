<script>
  import Tree from "./Tree.svelte";
  export let item;
  export let open;
</script>

{#if !item.children}
  <li>
    <a
      href="#"
      class="link-dark rounded"
      data-bs-dismiss="offcanvas"
      on:click={() =>
        open(
          item.id.toString(),
          item.attributes.link1,
          item.attributes.params.toString()
        )}>{item.text}</a
    >
  </li>
{:else}
  <li class="mb-1">
    <button
      class="btn btn-toggle align-items-center rounded collapsed fs-5"
      data-bs-toggle="collapse"
      data-bs-target="#d{item.id}"
      aria-expanded="false"
    >
      {item.text}
    </button>
    <div class="collapse" id="d{item.id}" style="margin-left:15px">
      <Tree items={item.children} {open} />
    </div>
  </li>{/if}
