import Point from '../utils/Point'
import Shape from '../utils/Shape'
import { ComponentObserver } from './ComponentObserver'
import ViewComponent from './ViewComponent'
import { ViewElement } from './ViewElement'

class Track implements ViewComponent {
  constructor(
    public element: ViewElement,
    private clickObserver: ComponentObserver,
    private resizeObserver: ComponentObserver,
    private range: ViewComponent,
    private handles: ViewComponent
  ) {}

  render(): void {
    return
  }

  onClick(handler: (point: Point) => void): void {
    this.clickObserver.listen(this, this.range, this.handles)
    this.clickObserver.bind((e) => {
      handler({
        x: e.point.x - this.element.position.x,
        y: e.point.y - this.element.position.y,
      })
    })
  }

  onResize(handler: (size: Shape) => void): void {
    this.resizeObserver.listen(this)
    this.resizeObserver.bind((e) => handler(e.target.element))
  }
}

export default Track
