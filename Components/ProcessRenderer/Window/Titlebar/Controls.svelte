<script lang="ts">
  import { killProcess } from "$ts/apps/process/kill";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";

  export let pid: number;
  export let app: ReadableStore<App>;

  function minimize() {
    $app.state.minimized = !$app.state.minimized;
  }

  function maximize() {
    $app.state.maximized = !$app.state.maximized;
  }

  function close() {
    killProcess(pid);
  }
</script>

<div class="controls">
  <button
    class="min material-icons-round"
    disabled={!$app.controls.minimize}
    on:click={minimize}
  >
    minimize
  </button>
  <button
    class="max material-icons-round"
    disabled={!$app.controls.maximize}
    on:click={maximize}
  >
    crop_square
  </button>
  <button
    class="close material-icons-round"
    disabled={!$app.controls.close}
    on:click={close}
  >
    close
  </button>
</div>
