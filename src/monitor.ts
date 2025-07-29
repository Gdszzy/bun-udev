// monitor.ts
// import { udev, UdevContext, assertFFIPointer, UdevDeviceInfo, getUdevDeviceInfo } from './udev';
import { type Pointer } from 'bun:ffi'
import udev from './udev'
import { type UdevDeviceInfo, getUdevDeviceInfo, UdevContext } from './context';

// 定义 udev 事件的类型
export type UdevMonitorEvent = {
  action: string;
  device: UdevDeviceInfo;
};

export class UdevMonitor {
  monitor: Pointer | null;
  context: UdevContext;
  fd: number = 0;
  worker = new Worker(new URL('./poll.ts', import.meta.url).href);
  workerReady = false
  startWorkerAfterReady = false
  callback: (info: UdevDeviceInfo) => void

  constructor(udevContext: UdevContext, source: string = "udev", callback: (info: UdevDeviceInfo) => void) {
    this.context = udevContext;
    this.monitor = udev.udev_monitor_new_from_netlink(this.context.handle, Buffer.from(source + '\0'));
    this.callback = callback
    if (this.monitor == null) {
      throw new Error("Failed to create udev monitor")
    }
    this.worker.onmessage = this.onMessage
  }

  onMessage = (evt: MessageEvent) => {
    if (evt.data.action == "event") {
      const devicePtr = udev.udev_monitor_receive_device(this.monitor)
      if (devicePtr == null) {
        return
      }
      const deviceInfo = getUdevDeviceInfo(devicePtr)
      this.callback(deviceInfo)
    } else if (evt.data.action == "ready") {
      this.workerReady = true
      if (this.startWorkerAfterReady) {
        this.start()
      }
    }
  }

  addFilter(subsystem: string, devtype: string | null = null): this {
    const result = udev.udev_monitor_filter_add_match_subsystem_devtype(this.monitor, Buffer.from(subsystem + '\0'), devtype == null ? null : Buffer.from(devtype + '\0'));
    if (result < 0) {
      throw new Error(`Failed to add monitor filter for subsystem '${subsystem}' and devtype '${devtype}'.`);
    }
    return this;
  }

  addTagFilter(tag: string): this {
    const result = udev.udev_monitor_filter_add_match_tag(this.monitor, Buffer.from(tag + '\0'));
    if (result < 0) {
      throw new Error(`Failed to add monitor tag filter: ${tag}`);
    }
    return this;
  }

  start() {
    if (this.fd == 0) {
      const enableResult = udev.udev_monitor_enable_receiving(this.monitor);
      if (enableResult < 0) {
        throw new Error(`Failed to enable monitor receiving: ${enableResult}`);
      }
      this.fd = udev.udev_monitor_get_fd(this.monitor);
      if (this.fd < 0) {
        throw new Error(`Failed to get monitor file descriptor: ${this.fd}`);
      }
    }
    if (this.workerReady) {
      this.worker.postMessage({ action: 'start', fd: this.fd })
    } else {
      this.startWorkerAfterReady = true
    }
  }

  stop() {
    this.worker.postMessage({ action: 'stop' })
  }

  dispose(): void {
    if (this.monitor != null) {
      udev.udev_monitor_unref(this.monitor);
      this.monitor = null;
    }
    this.worker.unref();
  }
}