import { UdevMonitor } from '../src/monitor'
import { UdevContext } from '../src/context'

const context = new UdevContext()
const monitor = new UdevMonitor(context, "udev", (info) => {
  console.log(info)
})
monitor.start()

setTimeout(() => {
  console.log('stop')
  monitor.stop()
  monitor.dispose()
  context.dispose()
}, 2000)