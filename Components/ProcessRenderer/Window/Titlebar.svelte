<script lang="ts">
  import { ArcOSVersion } from "$ts/env";
  import { ARCOS_MODE } from "$ts/metadata";
  import { UserDataStore } from "$ts/stores/user";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import Controls from "./Titlebar/Controls.svelte";

  export let app: ReadableStore<App>;
  export let pid: number;
  export let showIcon = true;
  export let showTitle = true;
  export let center = false;
</script>

{#if !$app.metadata.core}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="titlebar"
    class:left={$UserDataStore.sh.window.lefttb}
    class:center={$UserDataStore.sh.window.centertb || center}
  >
    <div class="title">
      <slot />

      {#if showIcon}
        <img src={$app.metadata.icon} alt={$app.id} />
      {/if}
      {#if showTitle}
        <span class="title-text">
          {$app.metadata.name}
          {#if ARCOS_MODE == "development"}
            - {$app.metadata.version} - {pid} [v{ArcOSVersion}-{ARCOS_MODE}]
          {/if}
        </span>
      {/if}
    </div>
    <div class="blank" />
    <Controls {app} {pid} />
  </div>
{/if}
