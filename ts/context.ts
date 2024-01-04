import { getAppById } from "$ts/apps";
import { Log } from "$ts/console";
import { sleep } from "$ts/util";
import { ContextMenuInstance, ContextMenuItem } from "$types/app";
import { Nullable } from "$types/common";
import { contextData, validContexMenuTags } from "./store";

export function createContextMenu(data: ContextMenuInstance) {
  Log("Desktop/ts/context", `Spawning Context Menu with ${data.items.length} items at ${data.x}, ${data.y}`);

  contextData.set(data)
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

  if (!window || !scope) return;

  const id = window.id
  const appData = getAppById(id);

  if (!appData) return;

  const contextmenu = scope.dataset.contextmenu;

  await sleep();

  const items = getContextEntry(id, contextmenu);

  createContextMenu({
    x: e.clientX, y: e.clientY, items, scope: contextmenu, scopeMap: scope.dataset
  })
}

export function composePosition(
  x: number,
  y: number,
  mW: number,
  mH: number
): [number, number] {

  const desktop = document.querySelectorAll(
    "div.state-ArcOS-desktop > div.desktop"
  )[0] as HTMLDivElement;

  if (!desktop) return [0, 0];

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


export function getContextEntry(
  id: string,
  scope: string
): ContextMenuItem[] {
  Log("Desktop/ts/context", `Getting Context Entries of ${id} in scope ${scope}`);

  const app = getAppById(id);

  if (!app || !app.contextMenu) return [];

  const menu = Object.entries(app.contextMenu);

  for (let i = 0; i < menu.length; i++) {
    if (scope.includes(menu[i][0])) return menu[i][1];
  }

  return [];
}

export function getContexMenuScope(e: MouseEvent): HTMLDivElement {
  const p = e.composedPath() as HTMLDivElement[];

  for (let i = 0; i < p.length; i++) {
    const tag = p[i].tagName;

    if (!tag) continue;

    const contextmenu = p[i].dataset.contextmenu;

    if (validContexMenuTags.includes(tag.toLowerCase()) && contextmenu) {
      return p[i];
    }
  }

  return null;
}

export function getWindowByEventTarget(target: EventTarget[]): Nullable<HTMLDivElement> {
  Log("Desktop/ts/context", `Getting window by running through EventTarget (size ${target.length})`);

  for (let i = 0; i < target.length; i++) {
    const element = target[i] as HTMLDivElement;
    const tagName = element.tagName;

    if (!tagName) continue;

    if (tagName.toLowerCase() == "window") return element;
  }

  return null;
}