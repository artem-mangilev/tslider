import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Range extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  public move(position: Point): void {
    this.$elem.css('transform', `translate(${position.x}px, ${position.y}px)`)
  }
}

export default Range
