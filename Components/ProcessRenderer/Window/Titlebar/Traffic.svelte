<script lang="ts">
  import { ProcessStack } from "$ts/stores/process";
  import { AppMutator } from "$types/app";

  export let app: AppMutator;
  export let pid: number;

  function cls() {
    ProcessStack.kill(pid, true);
  }

  function min() {
    $app.state.minimized = true;
  }

  function max() {
    $app.state.maximized = true;
  }
</script>

<button class="traffic-cls reset" on:click={cls} disabled={!$app.controls.close} />
<button class="traffic-min reset" on:click={min} disabled={!$app.controls.minimize} />
<button class="traffic-max reset" on:click={max} disabled={!$app.controls.maximize} />

<style scoped>
  button {
    border: var(--button-bg) 1px solid;
    width: 12px;
    height: 12px;
    border-radius: 11px;
    padding: 0;
  }

  button + button {
    margin-left: 8px;
  }

  button:hover {
    opacity: 0.5;
  }

  button:active {
    opacity: 0.2;
  }
  button:disabled {
    background-color: var(--button-bg) !important;
    border: var(--button-hover-bg) 0.5px solid !important;
  }

  button.traffic-cls:not(:disabled) {
    border: #d04e41 0.5px solid !important;
    background-color: #ec695e !important;
  }
  button.traffic-min:not(:disabled) {
    border: #d59f3c 0.5px solid !important;
    background-color: #f5c14f !important;
  }

  button.traffic-max:not(:disabled) {
    border: #4fa63b 0.5px solid !important;
    background-color: #61c654 !important;
  }
</style>
