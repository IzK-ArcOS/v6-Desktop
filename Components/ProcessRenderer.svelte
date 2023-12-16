<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { ProcessMap } from "$types/process";
  import Window from "./ProcessRenderer/Window.svelte";

  let map: ProcessMap;

  ProcessStack.processes.subscribe((v) => {
    map = null;
    map = v;
  });
</script>

<div class="process-renderer">
  {#each [...map] as [pid, proc]}
    {#if proc._disposed}
      <div class="disposed pid-{pid}" />
    {:else if proc.app}
      <Window id={proc.app.id} {pid} />
    {/if}
  {/each}
</div>
