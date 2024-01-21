import { ReadableStore } from "$types/writable";

export interface DesktopStyleStores {
  accent: ReadableStore<string>;
  theme: ReadableStore<string>;
  style: ReadableStore<string>;
}