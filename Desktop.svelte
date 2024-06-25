<script lang="ts">
  import { alignDesktopIcons } from "$apps/Wallpaper/ts/icons";
  import { preventAnchorRedirects } from "$ts/anchor";
  import { loadBuiltinApps } from "$ts/apps/builtins";
  import { GlowingLogo } from "$ts/images/branding";
  import { sendNotification } from "$ts/notif";
  import { GlobalDispatch } from "$ts/process/dispatch/global";
  import { StartCoreProcesses } from "$ts/process/startup";
  import { flushVirtualFilesystem } from "$ts/server/fs/virtual";
  import { startInitialServices } from "$ts/service/interact";
  import { UserDataStore } from "$ts/stores/user";
  import { sleep } from "$ts/util";
  import { onMount } from "svelte";
  import ProcessRenderer from "./Components/ProcessRenderer.svelte";
  import ContextMenuRenderer from "./Components/ProcessRenderer/ContextMenuRenderer.svelte";
  import "./css/main.css";
  import { SafeMode, SafeModeStyle } from "./ts/store";
  import { DesktopStyle } from "./ts/styles";
  import { isLoaded } from "$ts/apps";
  import { isDisabled } from "$ts/apps/disable/utils";
  import OfflineCheck from "./Components/OfflineCheck.svelte";

  let render = false;
  let show = false;
  let { style, theme } = DesktopStyle();

  onMount(async () => {
    await loadBuiltinApps();
    await StartCoreProcesses();
    await startInitialServices();
    preventAnchorRedirects();
    await flushVirtualFilesystem();

    render = true;

    await sleep(200);

    if (!isLoaded("desktopWallpaper") || isDisabled("desktopWallpaper")) {
      GlobalDispatch.dispatch("desktop-show");
    }

    if (!$UserDataStore.acc.v6) {
      await alignDesktopIcons();

      sendNotification({
        title: "Welcome to ArcOS v6!",
        message:
          "Your ArcOS account has been updated to work with ArcOS v6. In order to accomplish this, we had to reset your desktop icons to work with the new apps.",
        image: GlowingLogo,
      });

      $UserDataStore.acc.v6 = true;
    }
  });

  GlobalDispatch.subscribe("desktop-hide", () => {
    show = false;
  });
  GlobalDispatch.subscribe("desktop-show", () => (show = true));
</script>

{#if $UserDataStore && render}
  <div
    class="desktop theme-{$SafeMode ? 'dark' : $theme} cursor-{$UserDataStore.sh.desktop
      .noCustomCursor
      ? ''
      : 'custom'}"
    class:safemode={$SafeMode}
    style={$SafeMode ? SafeModeStyle : $style}
    class:show
    class:sharp={$SafeMode || $UserDataStore.sh.desktop.sharp}
    class:noani={$SafeMode || !$UserDataStore.sh.anim}
    class:noglass={$SafeMode || $UserDataStore.sh.noGlass}
  >
    <ProcessRenderer />
    <ContextMenuRenderer />
    <OfflineCheck />
  </div>
{/if}
