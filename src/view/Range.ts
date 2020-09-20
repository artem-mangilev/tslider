import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'
import OrientationManager from './OrientationManager'

export interface RangeRenderData {
  position: Point
  length: number
}

class Range extends ViewTreeNode {
  constructor(private om: OrientationManager) {
    super('div', 'tslider__range')
  }

  render(data: RangeRenderData) {
    this.om.setWidth(this, data.length)
    this.move(data.position)
  }
}

export default Range
