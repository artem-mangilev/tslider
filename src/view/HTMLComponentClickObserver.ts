import HTMLViewElement from './HTMLViewElement'
import { ComponentEventHandler, ComponentObserver } from './ComponentObserver'
import ViewComponent from './ViewComponent'

class HTMLComponentClickObserver implements ComponentObserver {
  private targets: ViewComponent[]

  listen(...components: ViewComponent[]): void {
    this.targets = components
  }

  bind(handler: ComponentEventHandler): void {
    this.targets.forEach((target, index) =>
      this.bindHandler(target, index, handler)
    )
  }

  private bindHandler(
    target: ViewComponent,
    index: number,
    handler: ComponentEventHandler
  ): void {
    if (target.element instanceof HTMLViewElement) {
      target.element.$elem.on('click', (e) => {
        const point = { x: e.clientX, y: e.clientY }
        handler({ target, targetIndex: index, point })
      })
    }
  }
}

export default HTMLComponentClickObserver
