import udev from './udev'
import { type Pointer } from "bun:ffi"

export class UdevContext {
  context: Pointer | null

  constructor() {
    this.context = udev.udev_new();
    if (this.context == null) {
      throw new Error("Failed to create udev context")
    }
  }

  get handle(): Pointer {
    return this.context!;
  }

  dispose(): void {
    if (this.context != null) {
      udev.udev_unref(this.context);
      this.context = null;
    }
  }
}

export interface UdevDeviceInfo {
  action?: string | null;
  syspath?: string | null;
  subsystem?: string | null;
  devtype?: string | null;
  sysname?: string | null;
  devnode?: string | null;
  properties: { [key: string]: string | null };
}

export function getUdevDeviceInfo(devicePtr: Pointer): UdevDeviceInfo {
  const info: UdevDeviceInfo = {
    properties: {}
  };
  if (devicePtr === 0) return info;

  info.action = udev.udev_device_get_action(devicePtr)?.toString();
  info.syspath = udev.udev_device_get_syspath(devicePtr)?.toString();
  info.subsystem = udev.udev_device_get_subsystem(devicePtr)?.toString();
  info.devtype = udev.udev_device_get_devtype(devicePtr)?.toString();
  info.sysname = udev.udev_device_get_sysname(devicePtr)?.toString();
  info.devnode = udev.udev_device_get_devnode(devicePtr)?.toString();

  let propEntry = udev.udev_device_get_properties_list_entry(devicePtr)
  while (propEntry != null) {
    const key = udev.udev_list_entry_get_name(propEntry)?.toString()
    const value = udev.udev_list_entry_get_value(propEntry)?.toString()
    info.properties[key] = value
    propEntry = udev.udev_list_entry_get_next(propEntry)
  }

  return info;
}