import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'
import { ViewElementEventHandler, ViewElementObserver } from './ViewElementObserver'

class Track implements ViewComponent {
  constructor(
    public element: ViewElement,
    private clickObserver: ViewElementObserver,
    private resizeObserver: ViewElementObserver,
    private range: ViewComponent,
    private handles: ViewComponent
  ) {}

  render(): void {
    return
  }

  onClick(handler: ViewElementEventHandler): void {
    this.clickObserver.listen(
      this.element,
      this.range.element,
      this.handles.element
    )
    this.clickObserver.bind(handler)
  }

  onResize(handler: ViewElementEventHandler): void {
    this.resizeObserver.listen(this.element)
    this.resizeObserver.bind(handler)
  }
}

export default Track
