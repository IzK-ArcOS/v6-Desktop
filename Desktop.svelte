<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import "./css/main.css";

  let show = false;

  onMount(async () => {
    await loadBuiltinApps();
    await sleep(500);

    show = true;
  });
</script>

<div class="desktop" class:show>
  <ProcessRenderer />
</div>
