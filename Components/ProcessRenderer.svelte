<script lang="ts">
  import { processes } from "$ts/stores/apps";
  import { App } from "$types/app";

  let procs: [string, App | "disposed"][] = [];

  processes.subscribe((v) => (procs = Object.entries(v)));
</script>

<div class="process-renderer">
  {#each procs as [pid, proc]}
    {#if proc == "disposed"}
      <div class="disposed pid-{pid}"></div>
    {:else}
      <div class="window">{pid}</div>
    {/if}
  {/each}
</div>
