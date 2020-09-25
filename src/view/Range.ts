import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'
import OrientationManager from './OrientationManager'
import Shape from '../utils/Shape'
import ViewComponent from './ViewComponent'

export interface RangeRenderData {
  position: Point
  length: number
  track: Shape
}

class Range implements ViewComponent {
  element = new ViewTreeNode('div', 'tslider__range')

  constructor(private om: OrientationManager) {}

  render(data: RangeRenderData) {
    if (this.om.isVertical()) {
      data.position.x = data.position.x + data.length
    }

    this.om.setWidth(this.element, data.length)
    this.element.move(this.om.decodePoint(data.position, data.track))
  }
}

export default Range
