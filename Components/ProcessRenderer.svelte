<script lang="ts">
  import { ClosedPids, processes } from "$ts/stores/apps";
  import Window from "./ProcessRenderer/Window.svelte";
</script>

<div class="process-renderer">
  {#each [...$processes] as [pid, proc]}
    {#if proc == "disposed"}
      <div class="disposed pid-{pid}" />
    {:else}
      <Window {proc} {pid} closing={$ClosedPids.includes(pid)} />
    {/if}
  {/each}
</div>
