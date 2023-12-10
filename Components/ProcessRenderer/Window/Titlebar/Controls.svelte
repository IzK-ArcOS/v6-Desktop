<script lang="ts">
  import { killProcess } from "$ts/apps/process";
  import { App } from "$types/app";

  export let pid: number;
  export let app: App;

  function minimize() {
    app.state.minimized = true;
  }

  function maximize() {
    app.state.maximized = true;
  }

  function close() {
    killProcess(pid);
  }
</script>

<div class="controls">
  <button class="min" disabled={!app.controls.minimize} on:click={minimize}>
    minimize
  </button>
  <button class="max" disabled={!app.controls.maximize} on:click={maximize}>
    crop_square
  </button>
  <button class="close" disabled={!app.controls.close} on:click={close}>
    close
  </button>
</div>
