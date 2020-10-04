import {
  ViewElementObserver,
  ViewElementEventHandler,
} from './ViewElementObserver'
import { ViewElement } from './ViewElement'
import HTMLViewElement from './HTMLViewElement'

class HTMLViewElementClickObserver implements ViewElementObserver {
  private targets: ViewElement[]

  listen(...elements: ViewElement[]): void {
    this.targets = elements
  }

  bind(handler: ViewElementEventHandler): void {
    this.targets.forEach((target, index) =>
      this.bindHandler(target, index, handler)
    )
  }

  private bindHandler(
    target: ViewElement,
    index: number,
    handler: ViewElementEventHandler
  ): void {
    if (target instanceof HTMLViewElement) {
      target.$elem.on('click', (e) => {
        const point = { x: e.clientX, y: e.clientY }
        handler({ target, targetIndex: index, point })
      })
    }
  }
}

export default HTMLViewElementClickObserver
