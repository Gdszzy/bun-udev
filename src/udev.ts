import { dlopen, FFIType } from "bun:ffi";

const udev = dlopen(
  "libudev.so",
  {
    // Core udev context
    udev_new: { args: [], returns: FFIType.pointer },
    udev_unref: { args: [FFIType.pointer], returns: FFIType.pointer }, // Returns NULL

    // Enumerator
    udev_enumerate_new: { args: [FFIType.pointer], returns: FFIType.pointer },
    udev_enumerate_unref: { args: [FFIType.pointer], returns: FFIType.pointer }, // Returns NULL
    udev_enumerate_scan_devices: { args: [FFIType.pointer], returns: FFIType.int },
    udev_enumerate_get_list_entry: { args: [FFIType.pointer], returns: FFIType.pointer },
    udev_enumerate_add_match_subsystem: { args: [FFIType.pointer, FFIType.cstring], returns: FFIType.int },
    udev_enumerate_add_match_property: { args: [FFIType.pointer, FFIType.cstring, FFIType.cstring], returns: FFIType.int },

    // Device
    udev_device_new_from_syspath: { args: [FFIType.pointer, FFIType.cstring], returns: FFIType.pointer },
    udev_device_unref: { args: [FFIType.pointer], returns: FFIType.pointer }, // Returns NULL
    udev_device_get_action: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_device_get_syspath: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_device_get_subsystem: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_device_get_devtype: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_device_get_sysname: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_device_get_devnode: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_device_get_parent: { args: [FFIType.pointer], returns: FFIType.pointer },
    udev_device_get_parent_with_subsystem_devtype: { args: [FFIType.pointer, FFIType.cstring, FFIType.cstring], returns: FFIType.pointer },
    udev_device_get_property_value: { args: [FFIType.pointer, FFIType.cstring], returns: FFIType.cstring },
    udev_device_get_properties_list_entry: { args: [FFIType.pointer], returns: FFIType.pointer, },


    // List Entry
    udev_list_entry_get_name: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_list_entry_get_value: { args: [FFIType.pointer], returns: FFIType.cstring },
    udev_list_entry_get_next: { args: [FFIType.pointer], returns: FFIType.pointer },

    // Monitor
    udev_monitor_new_from_netlink: { args: [FFIType.pointer, FFIType.cstring], returns: FFIType.pointer },
    udev_monitor_unref: { args: [FFIType.pointer], returns: FFIType.pointer }, // Returns NULL
    udev_monitor_enable_receiving: { args: [FFIType.pointer], returns: FFIType.int },
    udev_monitor_filter_add_match_subsystem_devtype: { args: [FFIType.pointer, FFIType.cstring, FFIType.cstring], returns: FFIType.int },
    udev_monitor_filter_add_match_tag: { args: [FFIType.pointer, FFIType.cstring], returns: FFIType.int },
    udev_monitor_get_fd: { args: [FFIType.pointer], returns: FFIType.int },
    udev_monitor_receive_device: { args: [FFIType.pointer], returns: FFIType.pointer },
  },
);

export default udev.symbols