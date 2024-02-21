<script lang="ts">
  import { createContextMenu } from "$state/Desktop/ts/context";
  import { App, ContextMenuItem } from "$types/app";

  export let menu: ContextMenuItem;
  export let app: App;

  let button: HTMLButtonElement;

  async function action() {
    if (!menu.subItems && menu.action) return await menu.action(app, null, null);

    const rect = button.getBoundingClientRect();

    createContextMenu({
      items: menu.subItems,
      x: rect.x,
      y: rect.y + rect.height + 5,
    });
  }
</script>

{#if !menu.sep}
  <button class="menu-item" on:click={action} bind:this={button}>
    {menu.caption}
  </button>
{:else}
  <div class="sep" />
{/if}
