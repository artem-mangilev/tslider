import { ComponentObserver, ComponentEventHandler } from './ComponentObserver'
import HTMLViewElement from './HTMLViewElement'
import ViewComponent from './ViewComponent'

class HTMLComponentDragObserver implements ComponentObserver {
  private targets: ViewComponent[]

  listen(...components: ViewComponent[]): void {
    this.targets = components
  }

  bind(handler: ComponentEventHandler): void {
    this.targets.forEach((target, index) => {
      this.bindMouseOrTouchHandler('mouse', target, index, handler)
      this.bindMouseOrTouchHandler('touch', target, index, handler)
    })
  }

  private bindMouseOrTouchHandler(
    which: 'mouse' | 'touch',
    target: ViewComponent,
    index: number,
    handler: ComponentEventHandler
  ): void {
    if (target.element instanceof HTMLViewElement) {
      const start = which === 'mouse' ? 'mousedown' : 'touchstart'
      const move = which === 'mouse' ? 'mousemove' : 'touchmove'
      const end = which === 'mouse' ? 'mouseup' : 'touchend'

      const targetHtmlNode = target.element.$elem[0]
      const $root = $('html')
      $root.on(start, (e) => {
        e.target === targetHtmlNode &&
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

export default HTMLComponentDragObserver
