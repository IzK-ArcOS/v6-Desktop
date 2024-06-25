<script lang="ts">
  import { ErrorIcon } from "$ts/images/dialog";
  import { onDestroy, onMount } from "svelte";
  import "../css/offlinecheck.css";
  import Spinner from "$lib/Components/Spinner.svelte";

  let offline = false;

  function updateIsOffline() {
    offline = !navigator.onLine;
    offline = true;
  }

  onMount(() => {
    window.addEventListener("online", updateIsOffline);
    window.addEventListener("offline", updateIsOffline);
  });

  onDestroy(() => {
    window.removeEventListener("online", updateIsOffline);
    window.removeEventListener("offline", updateIsOffline);
  });
</script>

<div class="offline-check visible">
  <div class="shade" />
  <img src={ErrorIcon} alt="" />
  <h1>Connection lost!</h1>
  <p>
    Please check your internet connection. Don't close ArcOS! Your work is still here. This screen
    will disappear once you're back online.
  </p>
  <Spinner height={32} />
  <p class="status">Waiting for internet...</p>
</div>
