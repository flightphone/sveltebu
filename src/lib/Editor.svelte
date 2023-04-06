<script>
    import { onMount } from "svelte";
    import { mainObj } from "../store";
    import Vselect from "./Vselect.svelte";
    import Finder from "./Finder.svelte";
    export let setTitle;
    export let editDisp;
    export let findData;
    export let save_fun;
    let action;
    let ok_cancel;
    let WorkRow = {};
    findData.ColumnTab.map((column) => {
        WorkRow[column] = "";
    });

    let save = () => {
        let c = findData.curRow;
        let row = findData.MainTab[c];
        findData.ColumnTab.map((column) => {
            row[column] = WorkRow[column];
        });
        editDisp.close();
        if (save_fun) save_fun();
    };
    let edit = () => {
        WorkRow = {};
        let c = findData.curRow;
        let row = findData.MainTab[c];
        findData.ColumnTab.map((column) => {
            WorkRow[column] = row[column] == null ? "" : row[column];
        });
        findData.Fcols.map((column) => {
            if (column.DisplayFormat != "") {
                WorkRow[column.FieldName] = mainObj.dateformat(
                    WorkRow[column.FieldName],
                    column.DisplayFormat
                );
            }
        });
    };

    let add = () => {
        WorkRow = {};
        findData.ColumnTab.map((column) => {
            WorkRow[column] = "";
        });
    };

    let editSetting = () => {
        findData.curRow = 0;
        edit();
    };

    let selectFinder = (eid) => {
        findData.ReferEdit.Editors[eid].window_modal.hide();
        let column = findData.ReferEdit.Editors[eid];
        let c = findData.ReferEdit.Editors[eid].joinRow.FindConrol.curRow;
        let row = column.joinRow.FindConrol.MainTab[c];
        for (let s in column.joinRow.fields) {
            WorkRow[column.joinRow.fields[s]] = row[s];
        }
    };

    onMount(() => {
        findData.ReferEdit.Editors.map((column) => {
            if (column.joinRow && column.joinRow.classname == "Bureau.Finder")
                column.window_modal = new bootstrap.Modal(column.window, {
                    keyboard: true,
                });
        });

        editDisp.activate = (mode) => {
            action = mode;
            setTitle(Descr(), ok_cancel);
        };
        editDisp.open = () => {
            if (action == "edit") edit();
            if (action == "add") add();
            if (action == "setting") editSetting();
        };
    });
    let Descr = function () {
        if (action == "add") return "Add (" + findData.Descr + ")";
        if (action == "edit") return "Edit (" + findData.Descr + ")";

        if (action == "setting") return "Setting (" + findData.Descr + ")";
        return "?";
    };
</script>

<div hidden>
    <div class="btn-group" bind:this={ok_cancel}>
        <button type="button" class="btn btn-secondary" on:click={save}
            >{action == "add" ? "Add" : "Update"}</button
        >
        <button type="button" class="btn btn-primary" on:click={editDisp.close}
            >Cancel</button
        >
    </div>
</div>
{#each findData.ReferEdit.Editors as column, index}
    <div class="input-group mb-3">
        {#if !column.joinRow}
            <div class="form-floating">
                <input
                    type="text"
                    class="form-control"
                    id={column.FieldName}
                    bind:value={WorkRow[column.FieldName]}
                />
                <label for={column.FieldName}>{column.FieldCaption}</label>
            </div>
        {:else}
            {#if column.joinRow.classname == "Bureau.Finder"}
                <div class="input-group mb-3">
                    <div class="form-floating">
                        <input
                            type="text"
                            class="form-control"
                            id={column.FieldName}
                            bind:value={WorkRow[column.FieldName]}
                        />
                        <label for={column.FieldName}
                            >{column.FieldCaption}</label
                        >
                    </div>
                    <button
                        type="button"
                        class="btn btn-secondary input-group-text"
                        on:click={() => column.window_modal.show()}
                    >
                        <i class="bi bi-search" />
                    </button>
                </div>
            {/if}

            {#if column.joinRow.classname == "Bureau.GridCombo"}
                <div class="form-floating">
                    <Vselect
                        id={column.FieldName}
                        items={column.joinRow.FindConrol.MainTab}
                        item_value={column.joinRow.keyField}
                        item_text={column.joinRow.FindConrol.DispField}
                        field_value={WorkRow[column.joinRow.valField]}
                    />

                    <label for={column.FieldName}>{column.FieldCaption}</label>
                </div>
            {/if}
        {/if}
    </div>
{/each}

<!--finders-->

{#each findData.ReferEdit.Editors as column, index}
    {#if column.joinRow && column.joinRow.classname == "Bureau.Finder"}
        <div
            class="modal"
            bind:this={column.window}
            tabindex="-1"
            aria-labelledby="selectFilterModalLabel{index.toString()}"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1
                            id="selectFilterModalLabel{index.toString()}"
                            class="modal-title fs-5"
                        >
                            {column.joinRow.FindConrol.Descr} (select)
                        </h1>

                        <div class="btn-group">
                            <div bind:this={column.userNav} />
                            <button
                                type="button"
                                class="btn btn-secondary"
                                on:click={() => selectFinder(index)}
                                >Select</button
                            >
                            <button
                                type="button"
                                class="btn btn-primary"
                                data-bs-dismiss="modal">Cancel</button
                            >
                        </div>
                    </div>
                    <div class="modal-body">
                        <Finder
                            IdDeclare={column.joinRow.IdDeclare.toString()}
                            hih="450"
                            findData={column.joinRow.FindConrol}
                            editid={index}
                            setTitle={(title, user_con) =>
                                column.userNav.appendChild(user_con)}
                            {selectFinder}
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/each}
<!--finders-->
