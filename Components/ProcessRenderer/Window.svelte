<script lang="ts">
  import "$css/desktop/window.css";
  import { AppRuntime } from "$ts/apps";
  import { App } from "$types/app";
  import { draggable } from "@neodrag/svelte";
  import { onMount } from "svelte";
  import Titlebar from "./Window/Titlebar.svelte";
  import { sleep } from "$ts/util";

  export let app: App;
  export let pid: number;

  let visible = false;
  let runtime: AppRuntime;

  onMount(async () => {
    console.log(app);
    runtime = new app.runtime(app);

    await sleep(100);

    visible = true;
  });
</script>

{#if app && typeof pid == "number"}
  <window
    data-pid={pid}
    id={app.id}
    class:minimized={app.state.minimized}
    class:maximized={app.state.maximized}
    class:headless={app.state.headless}
    class:fullscreen={app.state.fullscreen}
    class:core={app.metadata.core}
    class:visible
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
