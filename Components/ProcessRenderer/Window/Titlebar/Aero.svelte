<script lang="ts">
  import { GetHelp } from "$ts/help";
  import { HelpArticles } from "$ts/stores/articles";
  import { ProcessStack } from "$ts/stores/process";
  import { AppMutator } from "$types/app";

  export let app: AppMutator;
  export let pid: number;

  function minimize() {
    $app.state.minimized = !$app.state.minimized;
  }

  function maximize() {
    $app.state.maximized = !$app.state.maximized;
  }

  function close() {
    ProcessStack.kill(pid, true);
  }

  function unsnap() {
    $app.state.snapping = false;
  }

  function help() {
    GetHelp($app.helpArticle);
  }
</script>

{#if $app.helpArticle || ($app.controls.maximize && $app.state.snapping)}
  <div class="titlebar-button-group">
    {#if $app.helpArticle}
      <button class="material-icons-round reset" on:click={help}>question_mark</button>
    {/if}
    {#if $app.controls.maximize && $app.state.snapping}
      <button class="material-icons-round reset" on:click={unsnap}>south_west</button>
    {/if}
  </div>
{/if}
<div class="titlebar-button-group">
  <button class="material-icons-round reset" disabled={!$app.controls.minimize} on:click={minimize}>
    minimize
  </button>
  <button
    class="material-icons-round reset"
    disabled={!$app.controls.maximize || $app.state.snapping}
    on:click={maximize}
  >
    crop_square
  </button>
  <button class="close material-icons-round reset" disabled={!$app.controls.close} on:click={close}>
    close
  </button>
</div>
