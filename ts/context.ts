import { getAppById } from "$ts/apps";
import { Log } from "$ts/console";
import { tryParseInt } from "$ts/int";
import { sleep } from "$ts/util";
import { ContextMenuInstance, ContextMenuItem } from "$types/app";
import { Nullable } from "$types/common";
import { contextData, validContexMenuTags } from "./store";

export function createContextMenu(data: ContextMenuInstance) {
  Log("Desktop/ts/context", `Spawning Context Menu with ${data.items.length} items at ${data.x}, ${data.y}`);

  contextData.set(data)
}

export function closeContextMenu() {
  contextData.set(null);
}

export function assignContextMenuHooks() {
  Log("Desktop/ts/context", "Assigning context menu hooks");

  document.addEventListener("click", (e) => {
    const el = document.querySelector(".desktop > .context-menu")

    if (!el || e.button != 0 || e.composedPath().includes(el)) return;

    contextData.set(null);
  });

  document.addEventListener("contextmenu", handleContext);
}

export async function handleContext(e: MouseEvent) {
  const window = getWindowByEventTarget(e.composedPath());
  const scope = getContexMenuScope(e);

  if (!window || !scope) return closeContextMenu();

  const id = window.id
  const appData = getAppById(id);

  if (!appData) return closeContextMenu();

  appData.pid = tryParseInt(window.dataset.pid);

  const contextmenu = scope.dataset.contextmenu;

  await sleep();

  const items = getContextEntry(id, contextmenu);

  createContextMenu({
    x: e.clientX, y: e.clientY, items, scope: contextmenu, scopeMap: scope.dataset, app: appData
  })
}

export function composePosition(
  x: number,
  y: number,
  mW: number,
  mH: number
): [number, number] {
  const dW = window.innerWidth;
  const dH = window.innerHeight;

  let newX = x;
  let newY = y;

  if (newX + mW > dW) newX = dW - mW - 10;
  if (newY + mH > dH) newY = dH - mH - 10;
  if (newX < 0) x = 10;
  if (newY < 0) y = 10;

  return [newX, newY];
}

export function composeTranslation(x: number, y: number, mW: number, mH: number) {
  const dW = window.innerWidth;
  const dH = window.innerHeight;

  let newX = 0;
  let newY = 0;

  if (x + mW > dW) newX = -mW - mW - 10;
  if (y + mH > dH) newY = -mH - mH - 10;

  return [newX, newY];
}


export function getContextEntry(
  id: string,
  scope: string
): ContextMenuItem[] {
  Log("Desktop/ts/context", `Getting Context Entries of ${id} in scope ${scope}`);

  const app = getAppById(id);

  if (!app || !app.contextMenu) return [];

  const menu = Object.entries(app.contextMenu);

  for (const [key, items] of menu) {
    if (scope.includes(key)) return items;
  }

  return [];
}

export function getContexMenuScope(e: MouseEvent): HTMLDivElement {
  const path = e.composedPath() as HTMLDivElement[];

  for (const element of path) {
    const tag = element.tagName;

    if (!tag) continue;

    const contextmenu = element.dataset.contextmenu;

    if (validContexMenuTags.includes(tag.toLowerCase()) && contextmenu) {
      return element;
    }
  }

  return null;
}

export function getWindowByEventTarget(target: EventTarget[]): Nullable<HTMLDivElement> {
  Log("Desktop/ts/context", `Getting window by running through EventTarget (size ${target.length})`);

  for (const element of target as HTMLDivElement[]) {
    const tagName = element.tagName;

    if (!tagName) continue;

    if (tagName.toLowerCase() == "window") return element;
  }

  return null;
}