import {
  ViewElementObserver,
  ViewElementEventHandler,
} from './ViewElementObserver'
import { ViewElement } from './ViewElement'
import HTMLViewElement from './HTMLViewElement'
import { throttle } from '../../utils/throttle'

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
        if (e.target === target.$elem[0]) {
          const moveHandler = (e: JQuery.Event) => {
            const x = which === 'mouse' ? e.clientX : e.touches[0].clientX
            const y = which === 'mouse' ? e.clientY : e.touches[0].clientY
            handler({ target, targetIndex: index, point: { x, y } })
          }

          $root.on(move, throttle(moveHandler, 10))
        }
      })
      $root.on(end, () => $root.off(move))
    }
  }
}

export default HTMLViewElementDragObserver
