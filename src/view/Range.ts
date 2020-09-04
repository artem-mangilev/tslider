import ViewTreeNode from '../utils/ViewTreeNode'
import Point from '../utils/Point'

class Range extends ViewTreeNode {
  constructor(private longSide: 'width' | 'height') {
    super('div', 'tslider__range')
  }

  render(position: Point, length: number) {
    this[this.longSide] = length
    this.move(position)
  }
}

export default Range
