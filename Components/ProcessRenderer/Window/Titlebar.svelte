<script lang="ts">
  import { App } from "$types/app";
  import Controls from "./Titlebar/Controls.svelte";

  export let app: App;
  export let pid: number;
</script>

<div class="titlebar">
  <div class="title">
    <img src={app.metadata.icon} alt={app.id} />
    <span>{app.metadata.name} - {app.metadata.version} - {pid}</span>
  </div>
  <Controls {app} {pid} />
</div>
