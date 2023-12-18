<script lang="ts">
  import { createTrayIcon, disposeTrayIcon } from "$apps/Shell/ts/tray";
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { spawnApp } from "$ts/apps/spawn";
  import { darkenColor, invertColor, lightenColor } from "$ts/color";
  import { FileIcon } from "$ts/images/filesystem";
  import { ProcessStack } from "$ts/stores/process";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import "./css/main.css";
  import { UserDataCommitter } from "./ts/userdata";
  import { ArcSoundBus } from "$ts/soundbus";

  let show = false;
  let style = "";
  let accent = "";
  let theme = "";

  onMount(async () => {
    await loadBuiltinApps();

    console.log(ArcSoundBus);
    ArcSoundBus.playSound("arcos.system.logon");

    await sleep(500);

    spawnApp("ArcTerm");

    await ProcessStack.spawn({
      proc: UserDataCommitter,
      name: "UserDataCommitter",
    });

    show = true;
  });

  UserDataStore.subscribe((v) => {
    if (!v) return;

    accent = $UserDataStore.sh.desktop.accent || "70D6FF";
    theme = $UserDataStore.sh.desktop.theme || "dark";

    style = `
    --accent: #${accent} !important;
    --accent-light: ${lightenColor(accent)} !important;
    --accent-lighter: ${lightenColor(accent, 0.65)} !important;
    --accent-dark: ${darkenColor(accent, 75)} !important;
    --accent-darkest: ${darkenColor(accent, 90)} !important;
    --accent-light-transparent: ${lightenColor(accent)}77 !important;
    --accent-light-invert: ${invertColor(lightenColor(accent))} !important;`;
  });
</script>

<div class="desktop theme-{theme}" {style} class:show>
  <ProcessRenderer />
</div>
