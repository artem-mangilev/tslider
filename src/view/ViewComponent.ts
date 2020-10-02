import { ViewElement } from './ViewElement'
import { ViewElementEventHandler } from './ViewElementObserver'

interface ViewComponent {
  element: ViewElement

  render(data: unknown): void

  onClick?(handler: ViewElementEventHandler): void
  onResize?(handler: ViewElementEventHandler): void
  onDrag?(handler: ViewElementEventHandler): void
}

export default ViewComponent
