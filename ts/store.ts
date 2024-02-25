import { Wallpapers } from "$ts/stores/wallpaper";
import { Store } from "$ts/writable";
import { ContextMenuInstance } from "$types/app";

export const SafeModeStyle = `
--accent: #FFFFFF !important;
--accent-transparent: #FFFFFF44 !important;
--accent-light: #FFFFFF!important;
--accent-lighter: #FFFFFF !important;
--accent-dark: #444 !important;
--accent-darkest: #000 !important;
--accent-light-transparent: #FFFFFF77 !important;
--accent-light-invert: #000000 !important;
--wallpaper: url(${Wallpapers.img15});`;

export const SafeMode = Store<boolean>(false);
export const contextData = Store<ContextMenuInstance>();
export const validContexMenuTags = [
  "button",
  "div",
  "span",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "img",
];
export const SEP_ITEM = { sep: true };
