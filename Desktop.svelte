<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { darkenColor, hex3to6, invertColor, lightenColor } from "$ts/color";
  import { NotificationService, sendNotification } from "$ts/notif";
  import { ArcSoundBus } from "$ts/soundbus";
  import { ProcessStack } from "$ts/stores/process";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import "./css/main.css";
  import { UserDataCommitter } from "./ts/userdata";
  import { StartCoreProcesses } from "$ts/process/startup";

  let render = false;
  let show = false;
  let style = "";
  let accent = "";
  let theme = "";

  onMount(async () => {
    await loadBuiltinApps();
    await StartCoreProcesses();

    ArcSoundBus.playSound("arcos.system.logon");

    render = true;

    sendNotification({
      title: "h",
      message: "a",
    });

    await sleep(500);

    show = true;
  });

  UserDataStore.subscribe((v) => {
    if (!v) return;

    accent = $UserDataStore.sh.desktop.accent || "70D6FF";
    theme = $UserDataStore.sh.desktop.theme || "dark";

    style = `
    --accent: ${hex3to6(accent)} !important;
    --accent-transparent: ${hex3to6(accent)}44 !important;
    --accent-light: ${lightenColor(accent)} !important;
    --accent-lighter: ${lightenColor(accent, 6.5)} !important;
    --accent-dark: ${darkenColor(accent, 75)} !important;
    --accent-darkest: ${darkenColor(accent, 90)} !important;
    --accent-light-transparent: ${lightenColor(accent)}77 !important;
    --accent-light-invert: ${invertColor(lightenColor(accent))} !important;`;
  });
</script>

{#if $UserDataStore && render}
  <div
    class="desktop theme-{theme}"
    {style}
    class:show
    class:sharp={$UserDataStore.sh.desktop.sharp}
    class:noani={!$UserDataStore.sh.anim}
    class:noglass={$UserDataStore.sh.noGlass}
  >
    <ProcessRenderer />
  </div>
{/if}
