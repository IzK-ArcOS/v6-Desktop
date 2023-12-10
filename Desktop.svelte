<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import { spawnProcess } from "$ts/apps/process";
  import { sleep } from "$ts/util";
  import "$css/desktop.css";

  let show = false;

  onMount(async () => {
    loadBuiltinApps();

    spawnProcess("desktopWallpaper");

    await sleep(500);

    show = true;
  });
</script>

<div class="desktop" class:show>
  <ProcessRenderer />
</div>
