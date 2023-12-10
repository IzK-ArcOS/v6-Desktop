<script lang="ts">
  import "$css/desktop/window.css";
  import { AppRuntime } from "$ts/apps";
  import { App, Coordinate } from "$types/app";
  import { DragEventData, draggable } from "@neodrag/svelte";
  import { onMount } from "svelte";
  import Titlebar from "./Window/Titlebar.svelte";
  import { sleep } from "$ts/util";
  import { focusedPid, maxZIndex, processes } from "$ts/stores/apps";
  import { generateCSS } from "$ts/apps/css";
  import { ReadableStore } from "$types/writable";
  import { Store } from "$ts/writable";

  export let proc: App;
  export let pid: number;

  let app: ReadableStore<App>;
  let style = "";
  let visible = false;
  let runtime: AppRuntime;
  let window: HTMLDivElement;
  let pos: Coordinate = { x: 0, y: 0 };

  onMount(async () => {
    pos = { ...proc.pos };
    app = Store<App>(proc);

    app.subscribe((v) => {
      if (!v) return;

      $maxZIndex++;
      style = generateCSS(v);
    });

    runtime = new $app.runtime($app);

    await sleep(100);

    visible = true;
  });

  function handleMouse() {
    $focusedPid = pid;
  }

  function dragEnd(e: CustomEvent<DragEventData>) {
    $app.pos.x = e.detail.offsetX;
    $app.pos.y = e.detail.offsetY;
  }

  focusedPid.subscribe((v) => {
    if (v != pid || $app.metadata.core) return;

    $maxZIndex++;

    window.style.zIndex = `${$maxZIndex}`;
  });
</script>

{#if $app && typeof pid == "number" && runtime}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <window
    bind:this={window}
    data-pid={pid}
    id={$app.id}
    class:minimized={$app.state.minimized}
    class:maximized={$app.state.maximized}
    class:headless={$app.state.headless}
    class:fullscreen={$app.state.fullscreen}
    class:resizable={$app.state.resizable}
    class:core={$app.metadata.core}
    class:glass={$app.glass}
    class:visible
    class:focused={$focusedPid == pid}
    {style}
    on:mousedown={handleMouse}
    on:neodrag:end={dragEnd}
    use:draggable={{
      disabled:
        /* $app.state.maximized ||  */ $app.metadata.core ||
        $app.state.minimized,
      handle: ".titlebar",
      bounds: { top: 0, left: 0, right: 0, bottom: -1000 },
      defaultPosition: pos,
      position: { x: $app.pos.x, y: $app.pos.y },
    }}
  >
    {#if !$app.metadata.core}
      <Titlebar {app} {pid} />
    {/if}
    <div class="body">
      <svelte:component this={$app.content} {pid} {$app} {runtime} />
    </div>
  </window>
{/if}
