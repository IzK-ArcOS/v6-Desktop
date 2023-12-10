<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import { spawnProcess } from "$ts/apps/process";

  onMount(() => {
    loadBuiltinApps();

    spawnProcess("desktopWallpaper");
  });
</script>

<div class="desktop">
  <ProcessRenderer />
</div>
