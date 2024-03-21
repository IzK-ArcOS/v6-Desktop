<script lang="ts">
  import { ARCOS_MODE } from "$ts/metadata";
  import { UserDataStore } from "$ts/stores/user";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import AltMenu from "./Body/AltMenu.svelte";
  import Controls from "./Titlebar/Controls.svelte";

  export let app: ReadableStore<App>;
  export let pid: number;
  export let showIcon = true;
  export let showTitle = true;
  export let center = false;
  export let noCenter = false;

  $: app;
</script>

{#if !$app.metadata.core}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="titlebar"
    class:left={$UserDataStore.sh.window.lefttb}
    class:center={!noCenter && ($UserDataStore.sh.window.centertb || center)}
    data-contextmenu="titlebar"
  >
    <div class="title">
      <span class="title-wrapper">
        {#if showIcon}
          <img src={$app.metadata.icon} alt={$app.id} />
        {/if}
        {#if showTitle}
          <span class="title-text">
            {$app.metadata.name}
            {#if ARCOS_MODE == "development"}
              {$app.metadata.version} [{pid}]
            {/if}
          </span>
        {/if}
      </span>
      <AltMenu {app} />
      <slot />
    </div>
    <div class="blank" />
    <Controls {app} {pid} />
  </div>
{/if}
