import { ViewElement } from './ViewElement'

type ViewComponentEventHandler = (data: unknown) => void

interface ViewComponent {
  element: ViewElement

  render(data: unknown): void

  onClick?(handler: ViewComponentEventHandler): void
  onResize?(handler: ViewComponentEventHandler): void
  onDrag?(handler: ViewComponentEventHandler): void
}

export default ViewComponent
