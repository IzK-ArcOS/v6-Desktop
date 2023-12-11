<script lang="ts">
  import { closedPids, processes } from "$ts/stores/apps";
  import { sleep } from "$ts/util";
  import { App } from "$types/app";
  import Window from "./ProcessRenderer/Window.svelte";

  let procs: /* [string, App | "disposed"] */ string[] = [];

  processes.subscribe(async (v) => {
    procs = [];
    await sleep(0); // Wait for animationFrame (PS 1 of 2)
    procs = Object.keys(v);
  });
</script>

<div class="process-renderer">
  {#each procs as pid}
    <!-- {console.log(proc)} -->
    {#if $processes[pid] == "disposed"}
      <div class="disposed pid-{pid}"></div>
    {:else}
      <Window
        proc={$processes[pid]}
        pid={parseInt(pid)}
        closing={$closedPids.includes(parseInt(pid))}
      />
    {/if}
  {/each}
</div>
