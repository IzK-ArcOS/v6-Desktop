<script lang="ts">
  import { AppRuntime, getAppById } from "$ts/apps";
  import { generateCSS } from "$ts/apps/css";
  import { focusedPid } from "$ts/stores/apps";
  import { ProcessStack } from "$ts/stores/process";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { Store } from "$ts/writable";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import { onMount } from "svelte";
  import OverlayProcessRenderer from "../OverlayProcessRenderer.svelte";
  import SubProcessRenderer from "../SubProcessRenderer.svelte";

  export let pid: number;
  export let app: App;

  let appData: ReadableStore<App> = Store(null);
  let render = false;
  let visible = false;
  let closing = false;
  let style = "";
  let runtime: AppRuntime;

  ProcessStack.closedPids.subscribe((v) => (closing = v.includes(pid)));

  onMount(async () => {
    render = true;

    await sleep();

    const proc = ProcessStack.getProcess(pid);
    const data = getAppById(app.id, proc.app);

    proc.setMutator(appData);

    appData.set(data);
    style = generateCSS(app);
    runtime = new $appData.runtime(
      $appData,
      appData,
      ProcessStack.getProcess(pid)
    );

    await sleep(100);

    focusedPid.set(pid);

    visible = true;
  });

  appData.subscribe((v) => {
    if (!v) return;

    style = generateCSS(v);
  });

  async function handleMouse() {
    await sleep();
    $focusedPid = pid;
  }
</script>

{#if $appData && typeof pid == "number" && runtime && $UserDataStore && render}
  {#if !$appData.noOverlayShade}
    <div
      class="overlay-shade"
      data-pid={pid}
      class:visible
      class:closing
      id="shade-{$appData.id}"
    />
  {/if}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <window
    data-pid={pid}
    id={$appData.id}
    class="overlay headless shell-colored"
    class:colored={$UserDataStore.sh.taskbar.colored}
    class:resizable={$appData.state.resizable}
    class:glass={$appData.glass}
    class:visible
    class:closing
    {style}
    on:mousedown={handleMouse}
  >
    <div class="body">
      {#if visible}
        <svelte:component
          this={$appData.content}
          {pid}
          app={$appData}
          {runtime}
        />
      {/if}
    </div>
    <OverlayProcessRenderer {pid} />
  </window>
  <SubProcessRenderer {pid} />
{/if}
