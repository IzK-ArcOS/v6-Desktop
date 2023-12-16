<script lang="ts">
  import { ClosedPids, processes } from "$ts/stores/apps";
  import { App } from "$types/app";
  import Window from "./ProcessRenderer/Window.svelte";

  let map: Map<number, App | "disposed">;

  processes.subscribe((v) => {
    map = null;
    map = v;
  });
</script>

<div class="process-renderer">
  {#each [...map] as [pid, proc]}
    {#if proc == "disposed"}
      <div class="disposed pid-{pid}" />
    {:else}
      <Window id={proc.id} {pid} closing={$ClosedPids.includes(pid)} />
    {/if}
  {/each}
</div>
