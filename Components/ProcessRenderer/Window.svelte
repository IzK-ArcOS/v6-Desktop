<script lang="ts">
  import "$css/desktop/window.css";
  import { AppRuntime } from "$ts/apps";
  import { App } from "$types/app";
  import { draggable } from "@neodrag/svelte";
  import { onMount } from "svelte";
  import Titlebar from "./Window/Titlebar.svelte";
  import { sleep } from "$ts/util";
  import { focusedPid, processes } from "$ts/stores/apps";
  import { generateCSS } from "$ts/apps/css";

  export let app: App;
  export let pid: number;

  let style = "";
  let visible = false;
  let runtime: AppRuntime;

  processes.subscribe(() => app && (style = generateCSS(app)));

  onMount(async () => {
    runtime = new app.runtime(app);

    await sleep(100);

    visible = true;
  });

  function handleMouse() {
    $focusedPid = pid;
  }
</script>

{#if app && typeof pid == "number" && runtime}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <window
    data-pid={pid}
    id={app.id}
    class:minimized={app.state.minimized}
    class:maximized={app.state.maximized}
    class:headless={app.state.headless}
    class:fullscreen={app.state.fullscreen}
    class:resizable={app.state.resizable}
    class:core={app.metadata.core}
    class:glass={app.glass}
    class:visible
    {style}
    on:mousedown={handleMouse}
    use:draggable={{
      disabled: app.state.maximized || app.metadata.core || app.state.minimized,
      handle: ".titlebar",
      bounds: { top: 0, left: 0, right: 0, bottom: -1000 },
      defaultPosition: { x: app.pos.x, y: app.pos.y },
    }}
  >
    {#if !app.metadata.core}
      <Titlebar {app} {pid} />
    {/if}
    <div class="body">
      <svelte:component this={app.content} {pid} {app} {runtime} />
    </div>
  </window>
{/if}
