import { Log } from "$ts/console";
import { GlobalDispatch } from "$ts/process/dispatch/global";
import { killAllApps } from "$ts/process/kill";
import { getAllServices, stopService } from "$ts/service/interact";
import { PrimaryState } from "$ts/states";
import { appLibrary } from "$ts/stores/apps";
import { ProcessStack } from "$ts/stores/process";
import { UserCache, UserDataStore, UserName, UserToken, defaultUserData } from "$ts/stores/user";
import { sleep } from "$ts/util";

export async function logout() {
  Log("Desktop/ts/logout", `Resetting data to default stores and logging out ${UserName.get()}...`);

  GlobalDispatch.dispatch("desktop-hide")

  await sleep(400);
  await killAllApps(true);

  appLibrary.set(new Map([]))

  const services = getAllServices();

  for (const [id] of services) {
    await stopService(id, true);
  }

  UserToken.set(null);
  UserDataStore.set(defaultUserData);
  localStorage.removeItem("arcos-remembered-token");
  UserCache.clear();
  ProcessStack.processes.set(new Map([]))
  PrimaryState.navigate("logoff");
}