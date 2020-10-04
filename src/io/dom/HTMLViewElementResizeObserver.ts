import {
  ViewElementObserver,
  ViewElementEventHandler,
} from './ViewElementObserver'
import { ViewElement } from './ViewElement'
import HTMLViewElement from './HTMLViewElement'
import { throttle } from '../../utils/throttle'

class HTMLViewElementResizeObserver implements ViewElementObserver {
  private targets: ViewElement[]

  listen(...elements: ViewElement[]): void {
    this.targets = elements
  }

  bind(handler: ViewElementEventHandler): void {
    const resizeObserverHandler = (entries: ResizeObserverEntry[]) => {
      entries.forEach((_, index) => {
        handler({ target: this.targets[index], targetIndex: index })
      })
    }

    const ro = new ResizeObserver(throttle(resizeObserverHandler, 10))

    this.targets.forEach((target) => {
      if (target instanceof HTMLViewElement) {
        ro.observe(target.$elem[0])
      }
    })
  }
}

export default HTMLViewElementResizeObserver
