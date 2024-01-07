<script lang="ts">
  import { UserDataStore } from "$ts/stores/user";
  import { Store } from "$ts/writable";
  import { App, ContextMenuItem } from "$types/app";
  import Item from "../Item.svelte";

  export let data: ContextMenuItem;
  export let scope: string = "";
  export let scopeMap: DOMStringMap;
  export let window: App = null;
  export let showSub = false;

  let style = "";
  let hideSubs = Store<boolean>(false);

  hideSubs.subscribe((v) => {
    if (!v) return;
    $hideSubs = false;
  });
</script>

{#if data.subItems}
  <div
    class="sub-items shell-colored"
    class:show={showSub}
    class:colored={$UserDataStore.sh.taskbar.colored}
    {style}
  >
    {#each data.subItems as item}
      <Item data={item} {scopeMap} {scope} {window} bind:hideSubs />
    {/each}
  </div>
{/if}
