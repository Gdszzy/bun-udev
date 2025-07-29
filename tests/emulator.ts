import { UdevContext } from "../src/context";
import { UdevEnumerator } from "../src/emulator";

const context = new UdevContext()
const emulator = new UdevEnumerator(context)

emulator.addMatchSubsystem("usb")
const list = emulator.scanDevices()
for (const item of list) {
  console.log(item)
}