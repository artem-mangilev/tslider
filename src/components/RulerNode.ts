import RulerSegment from '../model/RulerSegment'
import { OrientationManager } from '../utils/OrientationManager'
import ViewComponent from '../io/dom/ViewComponent'
import { ViewElement } from '../io/dom/ViewElement'

export interface RulerNodeRenderData {
  segment: RulerSegment
}

class RulerNode implements ViewComponent {
  constructor(public element: ViewElement, private om: OrientationManager) {}

  render({ segment }: RulerNodeRenderData): void {
    this.element.setContent(segment.value)

    const middle = this.om.getWidth(this.element) / 2
    const point = this.om.getPoint({ x: segment.point - middle, y: 0 })
    this.element.move(point)
  }
}

export default RulerNode
