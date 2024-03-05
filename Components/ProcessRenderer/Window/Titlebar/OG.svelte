<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { AppMutator } from "$types/app";

  export let app: AppMutator;
  export let pid: number;

  function minimize() {
    $app.state.minimized = true;
  }

  function close() {
    ProcessStack.kill(pid, true);
  }
</script>

<button class="reset" on:click={minimize} disabled={!$app.controls.minimize}>🗕</button>
<button class="reset close" on:click={close} disabled={!$app.controls.close}>✖</button>

<style scoped>
  button {
    width: 20px;
    height: 20px;
    margin: 0;
    padding-top: 0;
    padding-left: 5px;
    padding-bottom: 2px;
    border-radius: 5px;
    border: none;
    background-color: #0000001f;
    color: var(--fg);
    vertical-align: middle;
  }

  button + button {
    margin-left: 5px;
  }

  button:hover {
    background: rgba(100, 100, 100, 0.512);
  }

  button.close {
    background-color: rgba(255, 0, 0, 0.8);
    color: white;
  }

  button.close:hover {
    background: rgba(255, 50, 50, 1);
  }
</style>
