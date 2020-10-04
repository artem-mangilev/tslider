import Point from '../utils/Point'
import { OrientationManager } from '../utils/OrientationManager'
import Shape from '../utils/Shape'
import ViewComponent from '../io/dom/ViewComponent'
import { ViewElement } from '../io/dom/ViewElement'

export interface RangeRenderData {
  position: Point
  length: number
  track: Shape
}

class Range implements ViewComponent {
  constructor(public element: ViewElement, private om: OrientationManager) {}

  render(data: RangeRenderData): void {
    if (this.om.isVertical()) {
      data.position.x = data.position.x + data.length
    }

    this.om.setWidth(this.element, data.length)
    this.element.move(this.om.decodePoint(data.position, data.track))
  }
}

export default Range
