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

  let show = false;
  let style = "";
  let accent = "";

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

<div class="desktop" {style} class:show>
  <ProcessRenderer />
</div>
