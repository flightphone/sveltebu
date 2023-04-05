<script>
    export let items
    export let item_value
    export let item_text
    export let id
</script>


<select id="{id}" class="form-select">
    {#each items as e}
    <option value="{e[item_value]}">{e[item_text]}</option>
    {/each}
</select>
