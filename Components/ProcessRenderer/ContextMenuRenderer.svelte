<script lang="ts">
  import {
    assignContextMenuHooks,
    composePosition,
  } from "$state/Desktop/ts/context";
  import { contextData } from "$state/Desktop/ts/store";
  import { maxZIndex } from "$ts/stores/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { Store } from "$ts/writable";
  import { ContextMenuInstance } from "$types/app";
  import { onMount } from "svelte";
  import Item from "./ContextMenuRenderer/Item.svelte";

  let data: ContextMenuInstance;
  let menu: HTMLDivElement;
  let x = 0;
  let y = 0;
  let visible = false;
  let hideSubs = Store<boolean>(false);

  hideSubs.subscribe((v) => {
    v && ($hideSubs = false);
  });

  onMount(() => {
    assignContextMenuHooks();
  });

  contextData.subscribe(async (v) => {
    if (!v) return (visible = false);

    data = null;

    await sleep();

    data = v;

    await sleep();

    if (!menu) return;

    const mW = menu.offsetWidth;
    const mH = menu.offsetHeight;

    [x, y] = composePosition(v.x, v.y, mW, mH);

    await sleep();

    visible = !!data;
  });
</script>

<div
  class="context-menu shell-colored"
  class:compact={$UserDataStore.sh.compactContext}
  class:colored={$UserDataStore.sh.taskbar.colored}
  class:show={visible}
  style="top: {y}px; left: {x}px; z-index: {$maxZIndex + 10}"
  bind:this={menu}
>
  {#if data && hideSubs}
    {#each data.items as item}
      <Item
        window={data.app}
        scope={data.scope}
        scopeMap={data.scopeMap}
        data={item}
        bind:hideSubs
      />
    {/each}
  {/if}
</div>
