<script lang="ts">
  import "$css/desktop/window.css";
  import { AppRuntime } from "$ts/apps";
  import { generateCSS } from "$ts/apps/css";
  import { focusedPid, maxZIndex } from "$ts/stores/apps";
  import { sleep } from "$ts/util";
  import { Store } from "$ts/writable";
  import { App, Coordinate } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import { DragEventData, draggable } from "@neodrag/svelte";
  import { onMount } from "svelte";
  import Titlebar from "./Window/Titlebar.svelte";
  import { UserDataStore } from "$ts/stores/user";

  export let proc: App | "disposed";
  export let pid: number;
  export let closing = false;

  let app: ReadableStore<App>;
  let style = "";
  let visible = false;
  let runtime: AppRuntime;
  let window: HTMLDivElement;
  let pos: ReadableStore<Coordinate> = Store<Coordinate>({ x: 0, y: 0 });

  onMount(async () => {
    focusedPid.set(pid);

    proc = proc as App;

    app = Store<App>({ ...proc });
    $pos = { ...$app.pos };

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

  function drag(e: CustomEvent<DragEventData>) {
    $focusedPid = pid;

    if ($app.state.maximized) return;

    $pos = { x: e.detail.offsetX, y: e.detail.offsetY };
  }

  focusedPid.subscribe((v) => {
    if (!$app || v != pid || $app.metadata.core) return;

    $maxZIndex++;

    $app.size.w = window.offsetWidth;
    $app.size.h = window.offsetHeight;

    style = generateCSS($app);

    window.style.zIndex = `${$maxZIndex}`;

    $app.state.minimized = false;
  });

  function resize() {
    if ($app.state.maximized) return;

    $app.size.w = window.offsetWidth;
    $app.size.h = window.offsetHeight;
  }
</script>

{#if $app && typeof pid == "number" && runtime && $UserDataStore}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <window
    bind:this={window}
    data-pid={pid}
    id={$app.id}
    class="taskbar-bounds tb-{$UserDataStore.sh.taskbar.pos}"
    class:minimized={$app.state.minimized}
    class:maximized={$app.state.maximized}
    class:headless={$app.state.headless}
    class:fullscreen={$app.state.fullscreen}
    class:resizable={$app.state.resizable}
    class:core={$app.metadata.core}
    class:glass={$app.glass}
    class:visible
    class:focused={$focusedPid == pid}
    class:docked={$UserDataStore.sh.taskbar.docked}
    class:bigtb={$UserDataStore.sh.window.bigtb}
    class:closing
    {style}
    on:mousedown={handleMouse}
    on:neodrag={drag}
    on:resize={resize}
    on:mousedown={resize}
    use:draggable={{
      disabled: $app.state.maximized,
      handle: ".titlebar",
      bounds: { top: 0, left: 0, right: 0, bottom: -1000 },
      position: $pos,
      defaultPosition: $pos,
    }}
  >
    <Titlebar {app} {pid} />
    <div class="body">
      <svelte:component this={$app.content} {pid} app={$app} {runtime} />
    </div>
  </window>
{/if}
