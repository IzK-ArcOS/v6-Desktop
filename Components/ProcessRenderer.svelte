<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { ProcessMap } from "$types/process";
  import "../css/processrenderer.css";
  import Window from "./ProcessRenderer/Window.svelte";

  export let handler = ProcessStack;

  let map: ProcessMap;

  handler.processes.subscribe((v) => {
    map = null;
    map = v;
  });
</script>

<div class="process-renderer fullscreen">
  {#each [...map] as [pid, proc]}
    {#if proc._disposed}
      <div class="disposed pid-{pid}" />
    {:else if proc.app && !proc.parentPid}
      <Window {pid} />
    {/if}
  {/each}
</div>
