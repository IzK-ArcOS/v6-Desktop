<script lang="ts">
  import { Nullable } from "$types/common";

  export let title: string;
  export let help: Nullable<() => any> = null;
  export let right = false;
  export let className = "";
</script>

<div class="segment {className}" class:right>
  <p class="title">
    {title}
    {#if help}
      <button class="help material-icons-round" on:click={help}>help</button>
    {/if}
  </p>
  <p class="value">
    <slot />
  </p>
</div>
