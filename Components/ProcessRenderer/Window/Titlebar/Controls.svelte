<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { App } from "$types/app";
  import { ReadableStore } from "$types/writable";

  export let pid: number;
  export let app: ReadableStore<App>;
  export let handler = ProcessStack;

  function minimize() {
    $app.state.minimized = !$app.state.minimized;
  }

  function maximize() {
    $app.state.maximized = !$app.state.maximized;
  }

  function close() {
    handler.kill(pid, true);
  }

  function unsnap() {
    $app.state.snapping = false;
  }
</script>

<div class="controls">
  {#if $app.controls.maximize && $app.state.snapping}
    <button
      class="unsnap material-icons-round titlebar-control reset"
      on:click={unsnap}
    >
      south_west
    </button>
  {/if}
  <button
    class="min material-icons-round titlebar-control reset"
    disabled={!$app.controls.minimize}
    on:click={minimize}
  >
    minimize
  </button>
  <button
    class="max material-icons-round titlebar-control reset"
    disabled={!$app.controls.maximize || $app.state.snapping}
    on:click={maximize}
  >
    crop_square
  </button>
  <button
    class="close material-icons-round titlebar-control reset"
    disabled={!$app.controls.close}
    on:click={close}
  >
    close
  </button>
</div>
