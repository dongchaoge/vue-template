import pako from 'pako'
import { weAtob } from './libs/wxAtob'
function mitt (all) {
  all = all || new Map()

  return {
    /**
     * A Map of event names to registered handler functions.
     */
    all,

    /**
     * Register an event handler for the given type.
     * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
     * @param {Function} handler Function to call in response to given event
     * @memberOf mitt
     */
    on (type, handler) {
      const handlers = all.get(type)
      const added = handlers && handlers.push(handler)
      if (!added) {
        all.set(type, [handler])
      }
    },

    /**
     * Remove an event handler for the given type.
     * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
     * @param {Function} handler Handler function to remove
     * @memberOf mitt
     */
    off (type, handler) {
      const handlers = all.get(type)
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1)
      }
    },

    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * Note: Manually firing "*" handlers is not supported.
     *
     * @param {string|symbol} type The event type to invoke
     * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
     * @memberOf mitt
     */
    emit (type, evt) {
      ;(all.get(type) || []).slice().map(handler => {
        handler(evt)
      })
      ;(all.get('*') || []).slice().map(handler => {
        handler(type, evt)
      })
    }
  }
}

let socketObj = {}
const control = {
  init (url, encryption = true) {
    const bus = mitt()
    const thisSocket = (socketObj[url] = socketObj[url] || {
      bus,
      // 开启状态
      open: false,
      // 用于关闭socket,false时会自动重连
      _close: false
    })
    contact()

    // 连接
    function contact () {
      // 连接socket
      const socketTask = uni.connectSocket({
        url,
        success: function (resConnect) {
          // 打开连接成功
          // console.log(resConnect)
        },
        fail: function (resConnectError) {
          // 打开连接失败
          // console.log(resConnectError)
        }
      })
      // open
      socketTask.onOpen(function (res) {
        console.log(url, '连接成功')
        onSocketOpen(socketTask)
      })
      socketTask.onMessage(res => {
        if (encryption) {
          try {
            const strData = weAtob(res.data)
            const charData = strData.split('').map(function (x) {
              return x.charCodeAt(0)
            })
            const binData = new Uint8Array(charData)
            const data = pako.inflate(binData, { to: 'string' })
            const msg = JSON.parse(data)
            bus.emit('socket-on-msg', msg, url)
          } catch (e) {
            // console.log(e)
            // console.log(res.data)
          }
        } else {
          try {
            const msg = JSON.parse(res.data)
            bus.emit('socket-on-msg', msg, url)
          } catch (e) {
            // console.log(e)
          }
        }
      })

      socketTask.onError(e => {
        console.log('连接错误', e)
        handleClose()
      })
      socketTask.onClose(e => {
        console.log(`连接已关闭...${e.code}-${e.reason}`)
        handleClose()
      })
    }

    // 打开连接
    function onSocketOpen (socketTask) {
      thisSocket.open = true
      bus.off('socket-send')
      bus.on('socket-send', data => {
        try {
          socketTask.send({
            data: JSON.stringify(data)
          })
        } catch (e) {
          console.log(e)
        }
      })
      bus.off('socket-close')
      bus.on('socket-close', () => {
        thisSocket._close = true
        socketTask.close()
      })
      bus.emit('socket-on', 'open')
    }

    // 关闭
    function handleClose () {
      thisSocket.open = false
      clearTimeout(thisSocket.timeOut)
      bus.off('socket-send')
      if (!thisSocket._close) {
        thisSocket.timeOut = setTimeout(() => {
          bus.emit('socket-on', 'reconnection')
          contact()
        }, 3000)
      }
    }

    return thisSocket
  },
  closeAll () {
    Object.values(socketObj).forEach(item => {
      item._close = true
      item.bus.emit('socket-close')
    })
    socketObj = {}
  }
}
export default {
  init: control.init,
  closeAll: control.closeAll,
  socketObj
}
