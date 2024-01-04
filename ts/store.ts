import { Store } from "$ts/writable";
import { ContextMenuInstance } from "$types/app";

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