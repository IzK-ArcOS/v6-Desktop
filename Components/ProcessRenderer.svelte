<script lang="ts">
  import { processes } from "$ts/stores/apps";
  import Window from "./ProcessRenderer/Window.svelte";
</script>

<div class="process-renderer">
  {#each Object.entries($processes) as [pid, proc]}
    {#if proc == "disposed"}
      <div class="disposed pid-{pid}"></div>
    {:else}
      <Window {proc} pid={parseInt(pid)} />
    {/if}
  {/each}
</div>
