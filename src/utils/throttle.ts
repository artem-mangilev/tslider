/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
type VariadicCallback = (...args: any[]) => void
export const throttle = (fn: VariadicCallback, wait: number) => {
  let inThrottle: boolean, lastFn: any, lastTime: number
  return function (...args: any[]) {
    const context = this
    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(function () {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args)
          lastTime = Date.now()
        }
      }, Math.max(wait - (Date.now() - lastTime), 0))
    }
  }
}
