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

    await sleep(0);

    const data = getAppById(id);

    console.log(data);

    app.set(Object.freeze(data));
    $pos = { ...$app.pos };
    style = generateCSS(data);
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

    window.style.zIndex = `${$maxZIndex}`;
  });

  // PERSONAL NOTE: @IzKuipers, 10:24 PM @ 25 dec 2023
  // Window property inheritance on the same process is an underlying issue
  // Open two instances, maximize one of them, focus the other and minimize it,
  // it WILL inherit the state of the other instance and be maximized and minimized
  // at the same time.

  // Potential solutions:
  // 1) Export the proc from Window.svelte and use `proc.app` instead of requesting it
  //    from the library, hopefully removing whatever inheritance this is
  // 2) Turn the state into a single variable instead of multiple, narrowing down the
  //    list of potential problem factors
  // 3) scrap v6. I'm not kidding.
</script>

{#if $app && typeof pid == "number" && runtime && $UserDataStore && render}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <window
    bind:this={window}
    data-pid={pid}
    id={$app.id}
    class="taskbar-bounds tb-{$UserDataStore.sh.taskbar.pos} shell-colored"
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
