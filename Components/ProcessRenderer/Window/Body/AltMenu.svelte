<script lang="ts">
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import MenuItem from "./AltMenu/MenuItem.svelte";

  export let app: ReadableStore<App>;
</script>

{#if $app.altMenu}
  <div class="alt-menu">
    {#each $app.altMenu as menu}
      <MenuItem {menu} app={$app} />
    {/each}
  </div>
{/if}
