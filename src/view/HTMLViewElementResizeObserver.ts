import {
  ViewElementObserver,
  ViewElementEventHandler,
} from './ViewElementObserver'
import HTMLViewElement, { ViewElement } from './ViewElement'

class HTMLViewElementResizeObserver implements ViewElementObserver {
  private targets: ViewElement[]

  listen(...elements: ViewElement[]): void {
    this.targets = elements
  }

  bind(handler: ViewElementEventHandler): void {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((_, i) => {
        handler({ target: this.targets[i] })
      })
    })

    this.targets.forEach((target) => {
      if (target instanceof HTMLViewElement) {
        ro.observe(target.$elem[0])
      }
    })
  }
}

export default HTMLViewElementResizeObserver
