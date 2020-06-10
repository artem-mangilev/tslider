import { Orientation } from '../utils/aliases'
import Point from '../utils/Point'
import ViewTreeNode from '../utils/ViewTreeNode'

class Range extends ViewTreeNode {
  constructor(className: string) {
    super('div', className)
  }

  draw(width: number, height: number, position: Point): void {
    this.$elem
      .css('width', `${width}px`)
      .css('height', `${height}px`)
      .css('transform', `translate(${position.x}px, ${position.y}px)`)
  }
}

export default Range
