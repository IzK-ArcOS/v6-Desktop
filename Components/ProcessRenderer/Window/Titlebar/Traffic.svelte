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
