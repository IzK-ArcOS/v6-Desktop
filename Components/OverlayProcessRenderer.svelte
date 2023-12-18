<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { ProcessMap } from "$types/process";
  import OverlayWindow from "./OverlayProcessRenderer/OverlayWindow.svelte";

  export let pid: number;

  let map: ProcessMap;

  ProcessStack.processes.subscribe(() => {
    map = null;
    map = ProcessStack.getOverlayProcesses(pid);
  });
</script>

<div class="process-renderer">
  {#each [...map] as [pid, proc]}
    {#if proc._disposed}
      <div class="disposed pid-{pid}" />
    {:else if proc.app && proc.parentPid && proc.app.isOverlay}
      <OverlayWindow app={proc.app} {pid} />
    {/if}
  {/each}
</div>
