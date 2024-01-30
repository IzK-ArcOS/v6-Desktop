<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { GlobalDispatch } from "$ts/process/dispatch/global";
  import { StartCoreProcesses } from "$ts/process/startup";
  import { startInitialServices } from "$ts/service/interact";
  import { ArcSoundBus } from "$ts/soundbus";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import ContextMenuRenderer from "./Components/ProcessRenderer/ContextMenuRenderer.svelte";
  import "./css/main.css";
  import { DesktopStyle } from "./ts/styles";
  import { preventAnchorRedirects } from "$ts/anchor";

  let render = false;
  let show = false;
  let { style, theme } = DesktopStyle();

  onMount(async () => {
    await loadBuiltinApps();
    await StartCoreProcesses();
    await startInitialServices();
    preventAnchorRedirects();

    ArcSoundBus.playSound("arcos.system.logon");

    render = true;

    await sleep(500);

    show = true;
  });

  GlobalDispatch.subscribe("desktop-hide", () => {
    show = false;
  });
  GlobalDispatch.subscribe("desktop-show", () => (show = true));
</script>

{#if $UserDataStore && render}
  <div
    class="desktop theme-{$theme} cursor-{$UserDataStore.sh.desktop
      .noCustomCursor
      ? ''
      : 'custom'}"
    style={$style}
    class:show
    class:sharp={$UserDataStore.sh.desktop.sharp}
    class:noani={!$UserDataStore.sh.anim}
    class:noglass={$UserDataStore.sh.noGlass}
  >
    <ProcessRenderer />
    <ContextMenuRenderer />
  </div>
{/if}
