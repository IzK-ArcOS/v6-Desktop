import SafeModeBg from "$assets/bg/safemode.png";
import { Store } from "$ts/writable";
import { ContextMenuInstance } from "$types/app";

export const SafeModeStyle = `
--accent: #FFBB00 !important;
--accent-transparent: #FFBB0044 !important;
--accent-light: #FFBB00 !important;
--accent-lighter: #FFBB00 !important;
--accent-dark: #444 !important;
--accent-darkest: #000 !important;
--accent-light-transparent: #FFBB0077 !important;
--accent-light-invert: #000000 !important;
--wallpaper: url(${SafeModeBg});`;

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
