import { cc, FFIType } from 'bun:ffi'

const {
  symbols: { poll_fd, get_errno },
} = cc({
  source: new URL('./poll.c', import.meta.url),
  symbols: {
    poll_fd: {
      returns: FFIType.int,
      args: [FFIType.int, FFIType.int],
    },
    get_errno: {
      returns: FFIType.int,
      args: []
    }
  },
});


let running = false;

async function execute(fd: number) {
  while (running) {
    let ret = poll_fd(fd, 0)
    if (ret < 0) {
      const errno = get_errno()
      if (errno == 4) {
        continue
      }
      postMessage({
        action: "error",
        errno: errno
      })
      running = false;
      return;
    } else if (ret > 0) {
      postMessage({
        action: "event"
      })
    }
  }
}

self.onmessage = (evt: MessageEvent) => {
  // receive fd
  if (evt.data.action == "start") {
    if (!running) {
      const fd = evt.data.fd
      running = true;
      execute(fd);
    }
  } else if (evt.data.action == "stop") {
    running = false
  }
}
// tell main thread I am ready
postMessage({
  action: 'ready'
})