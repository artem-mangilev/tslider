import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'
import OrientationManager from './OrientationManager'
import Shape from '../utils/Shape'

export interface RangeRenderData {
  position: Point
  length: number
  track: Shape
}

class Range extends ViewTreeNode {
  constructor(private om: OrientationManager) {
    super('div', 'tslider__range')
  }

  render(data: RangeRenderData) {
    if (this.om.isVertical()) {
      data.position.x = data.position.x + data.length
    }

    this.om.setWidth(this, data.length)
    this.move(this.om.decodePoint(data.position, data.track))
  }
}

export default Range
