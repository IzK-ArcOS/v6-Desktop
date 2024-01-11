<script lang="ts">
  import { contextData } from "$state/Desktop/ts/store";
  import { sleep } from "$ts/util";
  import { App, ContextMenuItem } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import { onMount } from "svelte";
  import SubItems from "./Item/SubItems.svelte";

  export let data: ContextMenuItem;
  export let scope: string = "";
  export let scopeMap: DOMStringMap;
  export let window: App = null;
  export let hideSubs: ReadableStore<boolean>;

  let active = false;
  let showSub = false;

  async function trigger() {
    if (data.subItems) return;

    if (data.action) data.action(window, scopeMap, scope);

    await sleep(50);

    contextData.set(null);

    update();
  }

  onMount(() => {
    update();

    hideSubs.subscribe((v) => v && (showSub = false));
  });

  async function update() {
    if (!data.isActive) return (active = false);

    active = await data.isActive(window, scopeMap, scope);
  }

  let inactiveTimer;

  function mouseEnter() {
    hideSubs.set(true);
    clearTimeout(inactiveTimer);
    showSub = true;
  }

  async function mouseLeave() {
    inactiveTimer = setTimeout(() => {
      showSub = false;
    }, 1000);
  }
</script>

{#if data.sep}
  <hr />
{:else}
  <button
    class="menu-item"
    on:click={trigger}
    class:active={active && !data.subItems}
    class:subitems={data.subItems && data.subItems.length}
    on:mouseenter={mouseEnter}
    on:mouseleave={mouseLeave}
  >
    <div class="inner">
      {#if data.icon}
        <span class="icon material-icons-round">{data.icon}</span>
      {:else if data.image}
        <img class="icon" src={data.image} alt={data.caption} />
      {/if}
      <span>
        {data.caption}
      </span>
    </div>
    <SubItems {data} {scopeMap} {scope} {window} {showSub} />
  </button>
{/if}
