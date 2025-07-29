// enumerator.ts
import { type Pointer } from "bun:ffi"
import udev from './udev'
import { UdevContext, getUdevDeviceInfo, type UdevDeviceInfo } from "./context";

export class UdevEnumerator {
  enumerator: Pointer | null
  context: UdevContext;

  constructor(udevContext: UdevContext) {
    this.context = udevContext;
    this.enumerator = udev.udev_enumerate_new(this.context.handle);
    if (this.enumerator == null) {
      throw new Error("Failed to create udev enumerator")
    }
  }

  addMatchSubsystem(subsystem: string): this {
    const result = udev.udev_enumerate_add_match_subsystem(this.enumerator, Buffer.from(subsystem + '\0'));
    if (result < 0) {
      throw new Error(`Failed to add subsystem match filter: ${subsystem}`);
    }
    return this;
  }

  addMatchProperty(key: string, value: string): this {
    const result = udev.udev_enumerate_add_match_property(this.enumerator, Buffer.from(key + '\0'), Buffer.from(value + '\0'));
    if (result < 0) {
      throw new Error(`Failed to add property match filter: ${key}=${value}`);
    }
    return this;
  }

  scanDevices(): UdevDeviceInfo[] {
    const result = udev.udev_enumerate_scan_devices(this.enumerator);
    if (result < 0) {
      throw new Error("Failed to scan devices");
    }

    const devices: UdevDeviceInfo[] = [];
    let listEntryPtr = udev.udev_enumerate_get_list_entry(this.enumerator);

    while (listEntryPtr !== null) {
      const syspath = udev.udev_list_entry_get_name(listEntryPtr);
      console.log(syspath)
      if (syspath) {
        let devicePtr: Pointer | null = null;
        try {
          // get detail
          devicePtr = udev.udev_device_new_from_syspath(this.context.handle, syspath.ptr);
          if (devicePtr != null) {
            const deviceInfo = getUdevDeviceInfo(devicePtr);
            devices.push(deviceInfo);
          }
        } finally {
          if (devicePtr != null) {
            udev.udev_device_unref(devicePtr);
          }
        }
      }
      listEntryPtr = udev.udev_list_entry_get_next(listEntryPtr);
    }
    return devices;
  }

  dispose(): void {
    if (this.enumerator != null) {
      udev.udev_enumerate_unref(this.enumerator);
      this.enumerator = null;
    }
  }
}