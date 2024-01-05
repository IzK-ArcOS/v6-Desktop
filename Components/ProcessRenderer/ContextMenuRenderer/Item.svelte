<script lang="ts">
  import { contextData } from "$state/Desktop/ts/store";
  import { sleep } from "$ts/util";
  import { App, ContextMenuItem } from "$types/app";
  import { onMount } from "svelte";

  export let data: ContextMenuItem;
  export let scope: string = "";
  export let scopeMap: DOMStringMap;
  export let window: App = null;

  let active = false;

  async function trigger() {
    console.log(window, scopeMap, scope);
    if (data.action) await data.action(window, scopeMap, scope);

    await sleep(50);

    contextData.set(null);

    update();
  }

  onMount(update);

  async function update() {
    if (!data.isActive) return (active = false);

    active = await data.isActive(window, scopeMap, scope);
  }
</script>

{#if data.sep}
  <hr />
{:else}
  <button class="menu-item" on:click={trigger} class:active>
    {#if data.icon}
      <span class="icon material-icons-round">{data.icon}</span>
    {:else if data.image}
      <img class="icon" src={data.image} alt={data.caption} />
    {/if}
    <span>
      {data.caption}
    </span>
  </button>
{/if}
