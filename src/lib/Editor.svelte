<script>
    import { onMount } from "svelte";
    export let setTitle;
    export let editDisp;
    export let findData;
    let action;
    let ok_cancel;
    onMount(() => {
        editDisp.activate = (mode) => {
            action = mode
            setTitle(Descr(), ok_cancel);
        };
    });
    let Descr = function () {
        if (action == "add") return "Add (" + findData.Descr + ")";
        if (action == "edit") return "Edit (" + findData.Descr + ")";

        if (action == "setting") return "Setting (" + findData.Descr + ")";
        return "?"
    };
</script>

aaa
<div hidden>
    <div class="btn-group" bind:this={ok_cancel}>
        <button type="button" class="btn btn-secondary" on:click={editDisp.close}
            >Update</button
        >
        <button type="button" class="btn btn-primary" on:click={editDisp.close}
            >Cancel</button
        >
    </div>
</div>
