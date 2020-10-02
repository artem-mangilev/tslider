import Point from '../utils/Point'
import Shape from '../utils/Shape'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'
import { ViewElementObserver } from './ViewElementObserver'

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

  onClick(handler: (point: Point) => void): void {
    this.clickObserver.listen(
      this.element,
      this.range.element,
      this.handles.element
    )
    this.clickObserver.bind((e) => {
      handler({
        x: e.point.x - this.element.position.x,
        y: e.point.y - this.element.position.y,
      })
    })
  }

  onResize(handler: (size: Shape) => void): void {
    this.resizeObserver.listen(this.element)
    this.resizeObserver.bind((e) => handler(e.target))
  }
}

export default Track
