<script lang="ts">
  export let current: string;
  export let selector: string;
</script>

<div class="tab" class:visible={current == selector}>
  <slot />
</div>
