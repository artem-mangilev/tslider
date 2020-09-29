import { ViewElement } from './ViewElement'

interface ViewComponent {
  element: ViewElement
  render(data: unknown): void
}

export default ViewComponent
