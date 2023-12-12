<script lang="ts">
  import { closedPids, processes } from "$ts/stores/apps";
  import Window from "./ProcessRenderer/Window.svelte";
</script>

<div class="process-renderer">
  {#each [...$processes] as [pid, proc]}
    {#if proc == "disposed"}
      <div class="disposed pid-{pid}"></div>
    {:else}
      <Window {proc} {pid} closing={$closedPids.includes(pid)} />
    {/if}
  {/each}
</div>
