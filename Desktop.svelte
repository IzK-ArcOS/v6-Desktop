<script lang="ts">
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { darkenColor, hex3to6, invertColor, lightenColor } from "$ts/color";
  import { ArcSoundBus } from "$ts/soundbus";
  import { ProcessStack } from "$ts/stores/process";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import "./css/main.css";
  import { UserDataCommitter } from "./ts/userdata";
  import { NotificationService, sendNotification } from "$ts/notif";
  import { PasswordIcon } from "$ts/images/general";

  let render = false;
  let show = false;
  let style = "";
  let accent = "";
  let theme = "";

  onMount(async () => {
    await loadBuiltinApps();

    ArcSoundBus.playSound("arcos.system.logon");

    await sleep(500);

    /** TODO: find a better way to start core services */
    await ProcessStack.spawn({
      proc: UserDataCommitter,
      name: "UserDataCommitter",
    });

    await ProcessStack.spawn({
      proc: NotificationService,
      name: "NotificationService",
    });

    sendNotification({
      title: "Test",
      message:
        "This is a very inclusive and extensive test of the notification service of ArcOS v6. This notification should appear in the notification center. It is handled using the new NotificationService.",
      image: PasswordIcon,
    });

    render = true;
    await sleep(0);
    show = true;
  });

  UserDataStore.subscribe((v) => {
    if (!v) return;

    accent = $UserDataStore.sh.desktop.accent || "70D6FF";
    theme = $UserDataStore.sh.desktop.theme || "dark";

    style = `
    --accent: ${hex3to6(accent)} !important;
    --accent-transparent: ${hex3to6(accent)}44 !important;
    --accent-light: ${lightenColor(accent)} !important;
    --accent-lighter: ${lightenColor(accent, 6.5)} !important;
    --accent-dark: ${darkenColor(accent, 75)} !important;
    --accent-darkest: ${darkenColor(accent, 90)} !important;
    --accent-light-transparent: ${lightenColor(accent)}77 !important;
    --accent-light-invert: ${invertColor(lightenColor(accent))} !important;`;
  });
</script>

{#if $UserDataStore && render}
  <div
    class="desktop theme-{theme}"
    {style}
    class:show
    class:sharp={$UserDataStore.sh.desktop.sharp}
    class:noani={!$UserDataStore.sh.anim}
    class:noglass={$UserDataStore.sh.noGlass}
  >
    <ProcessRenderer />
  </div>
{/if}
