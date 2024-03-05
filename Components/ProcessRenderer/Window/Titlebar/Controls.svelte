<script lang="ts">
  import { UserDataStore } from "$ts/stores/user";
  import { TitlebarButtons } from "$ts/stores/window";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import Default from "./Controls/Default.svelte";

  export let pid: number;
  export let app: ReadableStore<App>;
</script>

<div class="controls buttons-{$UserDataStore.sh.window.buttons}">
  {#if $UserDataStore && $UserDataStore.sh.window.buttons && TitlebarButtons[$UserDataStore.sh.window.buttons]}
    <svelte:component
      this={TitlebarButtons[$UserDataStore.sh.window.buttons].content}
      {app}
      {pid}
    />
  {:else}
    <Default {pid} {app} />
  {/if}
</div>
