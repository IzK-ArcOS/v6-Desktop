<script lang="ts">
  import { onMount } from "svelte";

  export let tabs: string[] = [];
  export let current = "";

  onMount(() => {
    current = tabs.length ? tabs[0] : "";
  });
</script>

<div class="tab-interface">
  <div class="tabs">
    {#each tabs as tab}
      <button class="tab" class:suggested={current == tab} on:click={() => (current = tab)}>
        {tab}
      </button>
    {/each}
    <div class="right">
      <slot name="right" />
    </div>
  </div>
  <slot name="renderer" />
</div>
