<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import "./css/main.css";
  import { UserDataStore } from "$ts/stores/user";
  import { darkenColor, invertColor, lightenColor } from "$ts/color";
  import { spawnProcess } from "$ts/apps/process";
  import { setUserData } from "$ts/server/user/data";
  import { createTrayIcon, disposeTrayIcon } from "$apps/Shell/ts/tray";
  import { DefaultIcon } from "$ts/images/apps";
  import { FileIcon } from "$ts/images/filesystem";

  let show = false;
  let style = "";
  let accent = "";
  let theme = "";

  onMount(async () => {
    await loadBuiltinApps();
    await sleep(500);

    spawnProcess("ArcTerm");

    show = true;
  });

  UserDataStore.subscribe((v) => {
    if (!v) return;

    setUserData(v);

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

    createTrayIcon({
      identifier: `${Math.floor(Math.random() * 1e9)}`,
      image: FileIcon,
      onOpen(tray) {
        disposeTrayIcon(tray.identifier);
      },
      title: `UserDataStore updated`,
    });
  });
</script>

<div class="desktop theme-{theme}" {style} class:show>
  <ProcessRenderer />
</div>
