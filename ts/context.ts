import { getAppById } from "$ts/apps";
import { Log } from "$ts/console";
import { tryParseInt } from "$ts/int";
import { sleep } from "$ts/util";
import { ContextMenuInstance, ContextMenuItem } from "$types/app";
import { Nullable } from "$types/common";
import { contextData, validContexMenuTags } from "./store";

/**
 * Spawns a new context menu based on the data
 * @param data The data to use for the menu
 */
export function createContextMenu(data: ContextMenuInstance) {
  Log("Desktop/ts/context", `Spawning Context Menu with ${data.items.length} items at ${data.x}, ${data.y}`);

  contextData.set(data)
}

/**
 * Closes the currently opened menu
 */
export function closeContextMenu() {
  contextData.set(null);
}

/**
 * Assigns the click event to close and spawn the context menu.
 */
export function assignContextMenuHooks() {
  Log("Desktop/ts/context", "Assigning context menu hooks");

  document.addEventListener("click", (e) => {
    const el = document.querySelector(".desktop > .context-menu")

    if (!el || e.button != 0 || e.composedPath().includes(el)) return;

    contextData.set(null);
  });

  document.addEventListener("contextmenu", handleContext);
}

/**
 * Handles right-click event to display a context menu based on the parsed data.
 * @param e The mouse event to use
 */
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

/**
 * Calculates the menu position to make sure it doesn't go off-screen
 * @param x The X position of the mouse
 * @param y The Y position of the mouse
 * @param mW The Width of the menu
 * @param mH The Height of the menu
 * @returns The new menu position
 */
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

/**
 * Gets the menu items of the given scope in the specified app
 * @param id The App ID to pull the menu items from
 * @param scope The Context Menu scope
 * @returns The menu items of the given scope
 */
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

/**
 * Calculates the Context Menu Scope by walking through the click's path
 * @param e The right-click event
 * @returns The scope or nothing
 */
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

/**
 * Gets the underlying window by walking through the right-click's event target
 * @param target The event target array to walk through
 * @returns The Window it found
 */
export function getWindowByEventTarget(target: EventTarget[]): Nullable<HTMLDivElement> {
  Log("Desktop/ts/context", `Getting window by running through EventTarget (size ${target.length})`);

  for (const element of target as HTMLDivElement[]) {
    const tagName = element.tagName;

    if (!tagName) continue;

    if (tagName.toLowerCase() == "window") return element;
  }

  return null;
}