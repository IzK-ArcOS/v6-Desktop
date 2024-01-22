import { Log } from "$ts/console";
import { GlobalDispatch } from "$ts/process/dispatch/global";
import { killAllApps } from "$ts/process/kill";
import { LogoffToken } from "$ts/server/user/logoff";
import { getAllServices, stopService } from "$ts/service/interact";
import { PrimaryState } from "$ts/states";
import { appLibrary } from "$ts/stores/apps";
import { ProcessStack } from "$ts/stores/process";
import { UserCache, UserDataStore, UserName, defaultUserData } from "$ts/stores/user";
import { sleep } from "$ts/util";

export async function logout() {
  Log("Desktop/ts/power", `Resetting data to default stores and logging out ${UserName.get()}...`);

  GlobalDispatch.dispatch("desktop-hide")

  await sleep(400);
  await killAllApps(true);

  appLibrary.set(new Map([]))

  const services = getAllServices();

  for (const [id] of services) {
    await stopService(id, true);
  }

  await LogoffToken();
  UserDataStore.set(defaultUserData);
  localStorage.removeItem("arcos-remembered-token");
  UserCache.clear();
  ProcessStack.processes.set(new Map([]))
  PrimaryState.navigate("logoff");
}

export async function shutdown() {
  GlobalDispatch.dispatch("desktop-hide")

  await sleep(400);
  await LogoffToken();

  Log("Desktop/ts/power", `Shutting down from ${UserName.get()}...`);

  PrimaryState.navigate("shutdown");
}

export async function restart() {
  GlobalDispatch.dispatch("desktop-hide")

  await sleep(400);
  await LogoffToken();

  Log("Desktop/ts/power", `Restarting from ${UserName.get()}...`);

  PrimaryState.navigate("restart");
}