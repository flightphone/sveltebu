<script>
    import { onMount } from "svelte";
    import { mainObj } from "../store";
    import Finder from "./Finder.svelte";
    import { Modal } from "../../node_modules/bootstrap/dist/js/bootstrap.esm.min.js";
    //import {Alert, Button, Carousel, Collapse, Dropdown, Modal, Offcanvas, Popover, ScrollSpy, Tab, Toast, Tooltip} from '../../node_modules/bootstrap/dist/js/bootstrap.esm.min.js'

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
    findData.ReferEdit.Editors.map((column) => {
        column.selected = {};
    });

    let save = async () => {
        let c = findData.curRow;
        let row = findData.MainTab[c];

        if (action == "setting") {
            findData.ColumnTab.map((column) => {
                row[column] = WorkRow[column];
            });

            editDisp.close();
            if (save_fun) save_fun();
            return;
        }

        for (let f in findData.DefaultValues) {
            WorkRow[f] = findData.DefaultValues[f];
        }

        for (let f in findData.TextParams) {
            WorkRow[f] = findData.TextParams[f];
        }
        //save db
        let SQLParams = {};
        findData.ReferEdit.SaveFieldList.map((f) => {
            SQLParams[f] = WorkRow[f];
        });
        //don't save in light version
        /*
        const url = mainObj.baseUrl + "React/exec";
        let bd = new FormData();

        bd.append("EditProc", findData.EditProc);
        bd.append("SQLParams", JSON.stringify(SQLParams));
        bd.append("KeyF", findData.KeyF);
        bd.append("IdDeclare", findData.IdDeclare);
        bd.append("mode", "data");
        const response = await fetch(url, {
            method: "POST",
            body: bd,
            cache: "no-cache",
            credentials: "include",
        });

        const res = await response.json();
        if (res.message != "OK") {
            mainObj.alert("Error:", res.message);
            return;
        }
        if (res.ColumnTab.length == 1) {
            WorkRow[findData.KeyF] = res.MainTab[0][res.ColumnTab[0]];
        } else {
            res.ColumnTab.map((column) => {
                WorkRow[column] = res.MainTab[0][column];
            });
        }
        */
        //save db

        if (action == "add") {
            c = 0;
            findData.MainTab.unshift({});
            row = findData.MainTab[0];
        }
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
                column.window_modal = new Modal(column.window, {
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
                    <select
                        id={column.FieldName}
                        class="form-select"
                        bind:value={WorkRow[column.joinRow.valField]}
                    >
                        {#each column.joinRow.FindConrol.MainTab as e}
                            <option value={e[column.joinRow.keyField]}
                                >{e[
                                    column.joinRow.FindConrol.DispField
                                ]}</option
                            >
                        {/each}
                    </select>
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
                    <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center">
                        <h1
                            id="selectFilterModalLabel{index.toString()}"
                            class="modal-title fs-5"
                        >
                            {column.joinRow.FindConrol.Descr} (select)
                        </h1>

                        <div style="display:flex">
                            <div bind:this={column.userNav} />
                            <div class="btn-group">
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
                    </div>
                    <div class="modal-body">
                        <Finder
                            id = ""
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
