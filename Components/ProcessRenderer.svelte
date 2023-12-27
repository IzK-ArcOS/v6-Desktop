<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { sleep } from "$ts/util";
  import "../css/processrenderer.css";
  import Window from "./ProcessRenderer/Window.svelte";

  export let handler = ProcessStack;

  let render = false;

  handler.processes.subscribe(async () => {
    render = false;
    await sleep(0);
    render = true;
  });
</script>

{#if render}
  <div class="process-renderer fullscreen">
    {#each handler.processes.get() as [pid, proc]}
      {#if proc._disposed}
        <div class="disposed pid-{pid}" />
      {:else if proc.app && !proc.parentPid}
        <Window id={proc.app.id} {pid} {handler} />
      {/if}
    {/each}
  </div>
{/if}
