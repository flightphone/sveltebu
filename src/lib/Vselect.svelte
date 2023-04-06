<script>
    export let items
    export let item_value
    export let item_text
    export let id
    export let field_value
</script>


<select id="{id}" class="form-select" bind:value={field_value}>
    {#each items as e}
    <option value="{e[item_value]}">{e[item_text]}</option>
    {/each}
</select>
