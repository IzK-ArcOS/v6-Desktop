<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { ProcessStoreValue } from "$types/process";
  import { ReadableStore } from "$types/writable";
  import { onMount } from "svelte";
  import "../css/processrenderer.css";
  import Window from "./ProcessRenderer/Window.svelte";

  export let handler = ProcessStack;

  let store: ReadableStore<ProcessStoreValue>;

  onMount(() => {
    store = handler.processes.mirror;
    store.subscribe((v) => {
      console.log(v);
    });
  });
</script>

{#if store}
  <div class="process-renderer fullscreen">
    {#each $store as [pid, proc]}
      {#if proc._disposed}
        <div class="disposed pid-{pid}" />
      {:else if proc.app && !proc.parentPid}
        <Window id={proc.app.id} {pid} {handler} />
      {/if}
    {/each}
  </div>
{/if}
