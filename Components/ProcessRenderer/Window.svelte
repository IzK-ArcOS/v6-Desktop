<script lang="ts">
  import "$css/desktop/window.css";
  import { AppRuntime } from "$ts/apps";
  import { generateCSS } from "$ts/apps/css";
  import { getAppById } from "$ts/apps/utils";
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
  import Titlebar from "./Window/Titlebar.svelte";
  import Body from "./Window/Body.svelte";

  export let pid: number;
  export let id: string;

  let closing = false;
  let app: ReadableStore<App> = Store(null);
  let style = "";
  let render = false;
  let visible = false;
  let runtime: AppRuntime;
  let window: HTMLDivElement;
  let pos: ReadableStore<Coordinate> = Store<Coordinate>({ x: 0, y: 0 });
  let inited = false;

  ProcessStack.closedPids.subscribe((v) => (closing = v.includes(pid)));

  onMount(async () => {
    render = true;

    await sleep(0);

    const proc = ProcessStack.getProcess(pid);
    const data = proc.app || getAppById(id);

    app.set(Object.create(data));
    $pos = { ...$app.pos };
    style = generateCSS(data);
    runtime = new $app.runtime($app, app, ProcessStack.getProcess(pid));

    await sleep(100);

    visible = true;
    inited = true;

    focusedPid.set(pid);
  });
  /* 
  app.subscribe((v) => {
    if (!v) return;

    $maxZIndex++;
    style = generateCSS(v);
  });
 */
  function handleMouse() {
    $focusedPid = pid;
  }

  function drag(e: CustomEvent<DragEventData>) {
    $focusedPid = pid;

    if ($app.state.maximized) return;

    $pos = { x: e.detail.offsetX, y: e.detail.offsetY };
  }

  focusedPid.subscribe((v) => {
    if (!$app || v != pid || $app.metadata.core || !inited || !window) return;

    $maxZIndex++;

    window.style.zIndex = `${$maxZIndex}`;

    $app.state.minimized = false;
  });
</script>

{#if $app && typeof pid == "number" && runtime && $UserDataStore && render}
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
    use:draggable={{
      disabled: $app.state.maximized,
      handle: ".titlebar",
      bounds: { top: 0, left: 0, right: 0, bottom: -1000 },
      position: $pos,
      defaultPosition: $pos,
    }}
  >
    {#if !$app.state.headless}
      <Titlebar {app} {pid} />
    {/if}
    <Body {app} {pid} {visible} {runtime} />
    <OverlayProcessRenderer {pid} />
  </window>
  <SubProcessRenderer {pid} />
{/if}
