<script lang="ts">
  import "$css/desktop/window.css";
  import { AppRuntime } from "$ts/apps";
  import { generateCSS } from "$ts/apps/css";
  import { getAppById } from "$ts/apps/utils";
  import { ProcessHandler } from "$ts/process";
  import { focusedPid, maxZIndex } from "$ts/stores/apps";
  import { ProcessStack } from "$ts/stores/process";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { Store } from "$ts/writable";
  import { App, Coordinate } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import { DragEventData, draggable } from "@neodrag/svelte";
  import { onMount } from "svelte";
  import OverlayProcessRenderer from "../OverlayProcessRenderer.svelte";
  import SubProcessRenderer from "../SubProcessRenderer.svelte";
  import Body from "./Window/Body.svelte";
  import Titlebar from "./Window/Titlebar.svelte";

  export let pid: number;
  export let id: string;
  export let handler: ProcessHandler = ProcessStack;

  let closing = false;
  let app: ReadableStore<App> = Store(null);
  let style = "";
  let render = false;
  let visible = false;
  let runtime: AppRuntime;
  let window: HTMLDivElement;
  let pos: ReadableStore<Coordinate> = Store<Coordinate>({ x: 0, y: 0 });
  let inited = false;

  onMount(async () => {
    render = true;

    await sleep();

    const proc = handler.getProcess(pid);
    const data = getAppById(id) || proc.app;

    app.set(data);
    $pos = { ...$app.pos };
    style = generateCSS($app);
    runtime = new $app.runtime($app, app, handler.getProcess(pid));

    await sleep(100);

    visible = true;
    inited = true;

    focusedPid.set(pid);

    handler.closedPids.subscribe((v) => (closing = v.includes(pid)));
  });

  function handleMouse() {
    $focusedPid = pid;
  }

  function drag(e: CustomEvent<DragEventData>) {
    $focusedPid = pid;

    if ($app.state.maximized) return;

    $pos = { x: e.detail.offsetX, y: e.detail.offsetY };
  }

  focusedPid.subscribe(async (v) => {
    if (!$app || v != pid || $app.metadata.core || !inited || !window) return;

    $maxZIndex++;

    $app.state.minimized = false;

    window.style.zIndex = `${$maxZIndex}`;
  });
</script>

{#if $app && typeof pid == "number" && runtime && $UserDataStore && render}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <window
    bind:this={window}
    data-pid={pid}
    id={$app.id}
    class="
      taskbar-bounds
      tb-{$UserDataStore.sh.taskbar.pos}
      {$app.state.snapState || ''}
      shell-colored"
    class:minimized={$app.state.minimized}
    class:maximized={$app.state.maximized || $app.state.snapping}
    class:headless={$app.state.headless}
    class:fullscreen={$app.state.fullscreen}
    class:resizable={$app.state.resizable}
    class:core={$app.metadata.core}
    class:glass={$app.glass}
    class:snapped={$app.state.snapping}
    class:visible
    class:focused={$focusedPid == pid}
    class:docked={$UserDataStore.sh.taskbar.docked}
    class:bigtb={$UserDataStore.sh.window.bigtb}
    class:colored={$UserDataStore.sh.taskbar.colored &&
      !$app.metadata.core &&
      $focusedPid == pid}
    class:closing
    {style}
    on:mousedown={handleMouse}
    on:neodrag={drag}
    use:draggable={{
      disabled: $app.state.maximized,
      handle: ".titlebar",
      bounds: { top: 0, left: 0, right: 0, bottom: -1000 },
      position: $pos,
      defaultPosition: $pos,
    }}
  >
    {#if !$app.state.headless}
      <Titlebar {app} {pid} {handler} />
    {/if}
    <Body {app} {pid} {visible} {runtime} />
    <OverlayProcessRenderer {pid} />
  </window>
  <SubProcessRenderer {pid} />
{/if}
