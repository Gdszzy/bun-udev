# bun-udev

[![npm version](https://img.shields.io/npm/v/@gdszzy/bun-udev)](https://www.npmjs.com/package/@gdszzy/bun-udev)

Using udev in bun via bun:ffi

## Usage

Add dependency

```shell
bun add @gdszzy/bun-udev
```

Enumerator

```js
import { UdevContext, UdevEnumerator } from '@gdszzy/bun-udev'

const context = new UdevContext()
const enumerator = new UdevEnumerator(context)

enumerator.addMatchSubsystem('usb')

const list = enumerator.scanDevices()
for (const item of list) {
  console.log(item)
}

// clean
enumerator.dispose()
context.dispose()
```

Monitor

```js
import { UdevContext, UdevMonitor } from '@gdszzy/bun-udev'

const context = new UdevContext()
const monitor = new UdevMonitor(context, 'udev', (info) => {
  console.log(info)
})
monitor.start()

// clean
monitor.stop()
monitor.dispose()
context.dispose()
```
