type VariadicCallback = (...args: unknown[]) => void
export const throttle = (fn: VariadicCallback, wait: number) => {
  let waiting = false
  return (...args: unknown[]) => {
    if (!waiting) {
      fn.apply(this, args)

      waiting = true

      setTimeout(() => {
        waiting = false
      }, wait)
    }
  }
}
