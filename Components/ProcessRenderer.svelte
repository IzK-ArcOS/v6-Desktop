<script lang="ts">
  import "../css/processrenderer.css";
  import { ProcessStack } from "$ts/stores/process";
  import { ProcessMap } from "$types/process";
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
      <Window id={proc.app.id} {pid} {handler} />
    {/if}
  {/each}
</div>
