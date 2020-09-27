import {
  ViewElementObserver,
  ViewElementEventHandler,
} from './ViewElementObserver'
import HTMLViewElement, { ViewElement } from './ViewElement'

class HTMLViewElementClickObserver implements ViewElementObserver {
  private targets: ViewElement[]

  listen(...elements: ViewElement[]): void {
    this.targets = elements
  }

  bind(handler: ViewElementEventHandler): void {
    this.targets.forEach((target) => this.bindHandler(target, handler))
  }

  private bindHandler(
    target: ViewElement,
    handler: ViewElementEventHandler
  ): void {
    if (target instanceof HTMLViewElement) {
      target.$elem.on('click', (e) => {
        const point = { x: e.clientX, y: e.clientY }
        handler({ target, point })
      })
    }
  }
}

export default HTMLViewElementClickObserver
