<script lang="ts">
  import { AppRuntime } from "$ts/apps";
  import { generateCSS } from "$ts/apps/css";
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

  let data: ReadableStore<App> = Store(null);
  let render = false;
  let visible = false;
  let closing = false;
  let style = "";
  let runtime: AppRuntime;

  ProcessStack.closedPids.subscribe((v) => (closing = v.includes(pid)));

  onMount(async () => {
    render = true;

    await sleep(0);

    data.set(app);
    style = generateCSS(app);
    runtime = new $data.runtime($data, data, ProcessStack.getProcess(pid));

    await sleep(100);

    visible = true;
  });

  data.subscribe((v) => {
    if (!v) return;

    style = generateCSS(v);
  });
</script>

{#if $data && typeof pid == "number" && runtime && $UserDataStore && render}
  <div class="overlay-shade" data-pid={pid} class:visible class:closing />
  <window
    data-pid={pid}
    id={$data.id}
    class="overlay headless"
    class:resizable={$data.state.resizable}
    class:glass={$data.glass}
    class:visible
    class:closing
    {style}
  >
    <div class="body">
      {#if visible}
        <svelte:component this={$data.content} {pid} app={$data} {runtime} />
      {/if}
    </div>
    <OverlayProcessRenderer {pid} />
  </window>
  <SubProcessRenderer {pid} />
{/if}
