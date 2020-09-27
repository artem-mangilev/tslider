import {
  ViewElementObserver,
  ViewElementEventHandler,
} from './ViewElementObserver'
import HTMLViewElement, { ViewElement } from './ViewElement'

class HTMLViewElementDragObserver implements ViewElementObserver {
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
      const $root = $('html')

      $root.on('mousedown', (e) => {
        e.target === target.$elem[0] &&
          $root.on('mousemove', (e) => {
            const point = { x: e.clientX, y: e.clientY }
            handler({ target, point })
          })
      })
      $root.on('mouseup', () => $root.off('mousemove'))

      $root.on('touchstart', (e) => {
        e.target === target.$elem[0] &&
          $root.on('touchmove', (e) => {
            const point = { x: e.clientX, y: e.clientY }
            handler({ target, point })
          })
      })
      $root.on('touchend', () => $root.off('touchmove'))
    }
  }
}

export default HTMLViewElementDragObserver
