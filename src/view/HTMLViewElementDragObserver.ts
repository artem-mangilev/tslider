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
    this.targets.forEach((target, index) => {
      this.bindMouseOrTouchHandler('mouse', target, index, handler)
      this.bindMouseOrTouchHandler('touch', target, index, handler)
    })
  }

  private bindMouseOrTouchHandler(
    which: 'mouse' | 'touch',
    target: ViewElement,
    index: number,
    handler: ViewElementEventHandler
  ): void {
    if (target instanceof HTMLViewElement) {
      const start = which === 'mouse' ? 'mousedown' : 'touchstart'
      const move = which === 'mouse' ? 'mousemove' : 'touchmove'
      const end = which === 'mouse' ? 'mouseup' : 'touchend'

      const $root = $('html')
      $root.on(start, (e) => {
        e.target === target.$elem[0] &&
          $root.on(move, (e) => {
            const x = which === 'mouse' ? e.clientX : e.touches[0].clientX
            const y = which === 'mouse' ? e.clientY : e.touches[0].clientY
            handler({ target, targetIndex: index, point: { x, y } })
          })
      })
      $root.on(end, () => $root.off(move))
    }
  }
}

export default HTMLViewElementDragObserver
