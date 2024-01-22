<script lang="ts">
  import { AppRuntime } from "$ts/apps";
  import { UserDataStore } from "$ts/stores/user";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";
  import AltMenu from "./Body/AltMenu.svelte";

  export let visible: boolean;
  export let app: ReadableStore<App>;
  export let pid: number;
  export let runtime: AppRuntime;
</script>

<div class="body">
  {#if visible}
    <svelte:component
      this={$app.content}
      {pid}
      app={$app}
      appMutator={app}
      {runtime}
      appdata={$UserDataStore ? $UserDataStore.appdata[$app.id] || {} : {}}
    />
  {/if}
</div>
