import { ErrorIcon } from "$ts/images/dialog";
import { isNotificationServiceActive, sendNotification } from "$ts/notif";
import { Process, ProcessHandler } from "$ts/process";
import { createErrorDialog } from "$ts/process/error";
import { StartCoreProcesses } from "$ts/process/startup";
import { setUserData } from "$ts/server/user/data";
import { UserDataStore } from "$ts/stores/user";
import { App } from "$types/app";
import { UserData } from "$types/user";
import { Unsubscriber } from "svelte/store";

export class UserDataCommitter extends Process {
  unsubscribe: Unsubscriber;

  constructor(handler: ProcessHandler, pid: number, name: string, app: App, args: any[]) {
    super(handler, pid, name, app, args);
  }

  start() {
    this.Log(`Starting UDC`);
    this.unsubscribe = UserDataStore.subscribe((v) => this.commit(v))
  }

  stop() {
    this.Log(`Stopping UDC`);

    const shellPid = this.handler.getAppPids("ArcShell")[0]

    const data = {
      title: "Can't save user data",
      message: "The User Data Committer service has been stopped. User Data will no longer be sent to ArcAPI. You can choose to restart core services to resume User Data saving.",
      image: ErrorIcon,
      buttons: [{ caption: "Do nothing", action() { } }, { caption: "Restart services", action() { StartCoreProcesses(true) }, suggested: true }]
    }

    if (isNotificationServiceActive()) {
      sendNotification(data)
    } else {
      createErrorDialog(data, shellPid || 0, !!shellPid);
    }

    if (!this.unsubscribe) return;

    this.unsubscribe();
    this.unsubscribe = null
  }

  async commit(data: UserData) {
    if (this._paused) return;

    await setUserData(data);
  }
}