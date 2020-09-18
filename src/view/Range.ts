import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'

export interface RangeRenderData {
  position: Point,
  length: number
}

class Range extends ViewTreeNode {
  constructor(private longSide: 'width' | 'height') {
    super('div', 'tslider__range')
  }

  render(data: RangeRenderData) {
    this[this.longSide] = data.length
    this.move(data.position)
  }
}

export default Range
