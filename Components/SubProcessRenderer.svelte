<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { ProcessMap } from "$types/process";
  import Window from "./ProcessRenderer/Window.svelte";

  export let pid: number;

  let map: ProcessMap;

  ProcessStack.processes.subscribe(() => {
    map = null;
    map = ProcessStack.getSubProcesses(pid);
  });
</script>

<div class="process-renderer subprocesses">
  {#each [...map] as [pid, proc]}
    {#if proc._disposed}
      <div class="disposed pid-{pid}" />
    {:else if proc.app && proc.parentPid && !proc.app.isOverlay}
      <Window id={proc.app.id} {pid} />
    {/if}
  {/each}
</div>
