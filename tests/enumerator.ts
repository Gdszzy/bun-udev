import { UdevContext } from "../src/context";
import { UdevEnumerator } from "../src/enumerator";

const context = new UdevContext()
const enumerator = new UdevEnumerator(context)

enumerator.addMatchSubsystem("usb")
const list = enumerator.scanDevices()
for (const item of list) {
  console.log(item)
}