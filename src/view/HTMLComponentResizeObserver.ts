import { ComponentObserver, ComponentEventHandler } from './ComponentObserver'
import HTMLViewElement from './HTMLViewElement'
import ViewComponent from './ViewComponent'

class HTMLComponentResizeObserver implements ComponentObserver {
  private targets: ViewComponent[]

  listen(...components: ViewComponent[]): void {
    this.targets = components
  }


  bind(handler: ComponentEventHandler): void {
    const ro = new ResizeObserver((entries) => {
      entries.forEach((_, index) => {
        handler({ target: this.targets[index], targetIndex: index })
      })
    })

    this.targets.forEach((target) => {
      if (target.element instanceof HTMLViewElement) {
        ro.observe(target.element.$elem[0])
      }
    })
  }
}

export default HTMLComponentResizeObserver
