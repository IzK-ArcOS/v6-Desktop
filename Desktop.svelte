<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { darkenColor, hex3to6, invertColor, lightenColor } from "$ts/color";
  import { StartCoreProcesses } from "$ts/process/startup";
  import { ArcSoundBus } from "$ts/soundbus";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import ContextMenuRenderer from "./Components/ProcessRenderer/ContextMenuRenderer.svelte";
  import "./css/main.css";
  import { getWallpaper } from "$ts/wallpaper";
  import { startInitialServices } from "$ts/service/interact";
  import { GlobalDispatch } from "$ts/process/dispatch/global";

  let render = false;
  let show = false;
  let style = "";
  let accent = "";
  let theme = "";

  onMount(async () => {
    await loadBuiltinApps();
    await StartCoreProcesses();
    await startInitialServices();

    ArcSoundBus.playSound("arcos.system.logon");

    render = true;

    await sleep(500);

    show = true;
  });

  UserDataStore.subscribe(async (v) => {
    if (!v) return;

    const wallpaper = $UserDataStore.sh.desktop.wallpaper;
    const wallpaperData = await getWallpaper(wallpaper);
    const bgUrl = wallpaperData.url;
    const bgThumb = wallpaperData.thumb;

    accent = $UserDataStore.sh.desktop.accent || "70D6FF";
    theme = $UserDataStore.sh.desktop.theme || "dark";

    style = `
    --accent: ${hex3to6(accent)} !important;
    --accent-transparent: ${hex3to6(accent)}44 !important;
    --accent-light: ${lightenColor(accent)} !important;
    --accent-lighter: ${lightenColor(accent, 6.5)} !important;
    --accent-dark: ${darkenColor(accent, 75)} !important;
    --accent-darkest: ${darkenColor(accent, 85)} !important;
    --accent-light-transparent: ${lightenColor(accent)}77 !important;
    --accent-light-invert: ${invertColor(lightenColor(accent))} !important;
    --wallpaper: url(${bgUrl});
    --wallpaper-thumb: url(${bgThumb});`;
  });

  GlobalDispatch.subscribe("desktop-hide", () => {
    show = false;
  });
  GlobalDispatch.subscribe("desktop-show", () => (show = true));
</script>

{#if $UserDataStore && render}
  <div
    class="desktop theme-{theme} cursor-{$UserDataStore.sh.desktop
      .noCustomCursor
      ? ''
      : 'custom'}"
    {style}
    class:show
    class:sharp={$UserDataStore.sh.desktop.sharp}
    class:noani={!$UserDataStore.sh.anim}
    class:noglass={$UserDataStore.sh.noGlass}
  >
    <ProcessRenderer />
    <ContextMenuRenderer />
  </div>
{/if}
