<script>
    import Tree_item from "./Tree_item.svelte";
    export let items;
    export let open;
</script>

<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 fs-5">
    {#each items as item}
        <Tree_item {item} {open} />
    {/each}
</ul>
