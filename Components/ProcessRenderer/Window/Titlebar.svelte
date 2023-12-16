<script lang="ts">
  import { ARCOS_MODE } from "$ts/metadata";
  import { ClosedPids } from "$ts/stores/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import Controls from "./Titlebar/Controls.svelte";

  export let app: ReadableStore<App>;
  export let pid: number;

  function maximize() {
    if ($ClosedPids.includes(pid)) return; // Closing: don't do anything

    //$app.state.maximized = !$app.state.maximized;
  }
</script>

{#if !$app.metadata.core}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="titlebar"
    on:dblclick={maximize}
    class:left={$UserDataStore.sh.window.lefttb}
    class:center={$UserDataStore.sh.window.centertb}
  >
    <div class="title">
      <img src={$app.metadata.icon} alt={$app.id} />
      <span>
        {$app.metadata.name}
        {#if ARCOS_MODE == "development"}
          <span> - {$app.metadata.version} - {pid}</span>
        {/if}
      </span>
    </div>
    <div class="blank" />
    <Controls {app} {pid} />
  </div>
{/if}
