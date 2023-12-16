<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { Process } from "$types/process";
  import Window from "./ProcessRenderer/Window.svelte";

  let map: Map<number, Process | "disposed">;

  ProcessStack.processes.subscribe((v) => {
    map = null;
    map = v;
  });
</script>

<div class="process-renderer">
  {#each [...map] as [pid, proc]}
    {#if proc == "disposed"}
      <div class="disposed pid-{pid}" />
    {:else if proc.app}
      <Window id={proc.app.id} {pid} closing={ProcessStack.isClosed(pid)} />
    {/if}
  {/each}
</div>
