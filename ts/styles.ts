import { darkenColor, hex3to6, invertColor, lightenColor } from "$ts/color";
import { UserDataStore } from "$ts/stores/user";
import { getWallpaper } from "$ts/wallpaper";
import { Store } from "$ts/writable";
import { UserData } from "$types/user";
import { DesktopStyleStores } from "./types";

export function DesktopStyle(): DesktopStyleStores {
  const style = Store<string>();
  const accent = Store<string>();
  const theme = Store<string>();

  let previous = "";
  let bgUrl = "";

  async function getWall(data: UserData) {
    if (!data) return;

    const wallpaper = data.sh.desktop.wallpaper;

    if (previous == wallpaper) return;

    previous = wallpaper;

    const u = (await getWallpaper(wallpaper)).url;

    if (u != bgUrl) bgUrl = u;

    return bgUrl
  }

  function getStyle(data: UserData) {
    if (!data) return;

    const a = data.sh.desktop.accent || "70D6FF";
    const t = data.sh.desktop.theme || "dark";

    accent.set(a);
    theme.set(t);

    const css = `
    --accent: ${hex3to6(a)} !important;
    --accent-transparent: ${hex3to6(a)}44 !important;
    --accent-light: ${lightenColor(a)} !important;
    --accent-lighter: ${lightenColor(a, 6.5)} !important;
    --accent-dark: ${darkenColor(a, 75)} !important;
    --accent-darkest: ${darkenColor(a, 85)} !important;
    --accent-light-transparent: ${lightenColor(a)}77 !important;
    --accent-light-invert: ${invertColor(lightenColor(a))} !important;
    --wallpaper: url(${bgUrl});`;

    return css;
  }

  UserDataStore.subscribe(async (v) => {
    await getWall(v);
    const css = getStyle(v);

    style.set(css);
  });

  return { style, accent, theme };
}